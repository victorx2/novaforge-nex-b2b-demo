import type { InventoryItem } from "./types";

/**
 * CSV esperado (cabecera flexible):
 * codigo,nombre,cantidad,ubicacion[,marca]
 * o part_number,description,qty,location[,brand]
 */
export function parseCsv(text: string): InventoryItem[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const rows = lines.map(splitCsvLine);
  const header = rows[0].map((h) => normalizeHeader(h));
  const hasHeader = header.some((h) =>
    ["codigo", "part_number", "nombre", "description", "cantidad", "qty"].includes(h),
  );

  const dataRows = hasHeader ? rows.slice(1) : rows;
  const col = hasHeader
    ? {
        code: indexOf(header, ["codigo", "part_number", "codigo_pieza", "sku"]),
        name: indexOf(header, ["nombre", "description", "descripcion", "desc"]),
        qty: indexOf(header, ["cantidad", "qty", "stock", "cant"]),
        loc: indexOf(header, ["ubicacion", "location", "ubicacion", "loc"]),
        brand: indexOf(header, ["marca", "brand"]),
      }
    : { code: 0, name: 1, qty: 2, loc: 3, brand: 4 };

  if (col.code < 0) {
    throw new Error("CSV sin columna de código (codigo / part_number).");
  }

  const items: InventoryItem[] = [];
  for (const row of dataRows) {
    const part_number = (row[col.code] ?? "").trim();
    if (!part_number) continue;
    const qtyRaw = col.qty >= 0 ? row[col.qty] : "0";
    const qty = Number(String(qtyRaw).replace(",", ".")) || 0;
    items.push({
      part_number,
      description: (col.name >= 0 ? row[col.name] : "")?.trim() || part_number,
      brand: (col.brand >= 0 ? row[col.brand] : "")?.trim() || "—",
      qty,
      location: (col.loc >= 0 ? row[col.loc] : "")?.trim() || "Sin ubicación",
    });
  }
  return items;
}

function normalizeHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "_");
}

function indexOf(header: string[], aliases: string[]): number {
  for (const a of aliases) {
    const i = header.indexOf(a);
    if (i >= 0) return i;
  }
  return -1;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((ch === "," || ch === ";") && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export const CSV_TEMPLATE = `codigo,nombre,cantidad,ubicacion,marca
6205-2RS,Rigido de bolas 25x52x15 2RS,48,Estante B3,SKF
6204-2RS,Rigido de bolas 20x47x14 2RS,32,Estante B2,NTN
6008-ZZ,Rigido de bolas 40x68x15 ZZ,11,Estante A4,FAG
`;
