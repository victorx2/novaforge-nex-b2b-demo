import type { ListingInput } from "./types";

/**
 * CSV tipo Víctor (5 columnas):
 * codigo,nombre,marca,modelo,observacion
 */
export function parseCsv(text: string): ListingInput[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const rows = lines.map(splitCsvLine);
  const header = rows[0].map((h) => normalizeHeader(h));
  const hasHeader = header.some((h) =>
    ["codigo", "part_number", "nombre", "name", "marca", "brand"].includes(h),
  );

  const dataRows = hasHeader ? rows.slice(1) : rows;
  const col = hasHeader
    ? {
        code: indexOf(header, [
          "codigo",
          "part_number",
          "codigo_pieza",
          "sku",
          "numero_de_parte",
        ]),
        name: indexOf(header, [
          "nombre",
          "name",
          "description",
          "descripcion",
          "producto",
        ]),
        brand: indexOf(header, ["marca", "brand"]),
        model: indexOf(header, ["modelo", "model", "medida", "dims"]),
        obs: indexOf(header, [
          "observacion",
          "observation",
          "obs",
          "condicion",
          "condition",
        ]),
      }
    : { code: 0, name: 1, brand: 2, model: 3, obs: 4 };

  if (col.code < 0) {
    throw new Error("CSV sin columna de código (codigo / part_number).");
  }

  const items: ListingInput[] = [];
  for (const row of dataRows) {
    const part_number = (row[col.code] ?? "").trim();
    if (!part_number) continue;
    items.push({
      part_number,
      name: (col.name >= 0 ? row[col.name] : "")?.trim() || part_number,
      brand: (col.brand >= 0 ? row[col.brand] : "")?.trim() || "—",
      model: (col.model >= 0 ? row[col.model] : "")?.trim() || "",
      observation: (col.obs >= 0 ? row[col.obs] : "")?.trim() || "Nuevo",
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

export const CSV_TEMPLATE = `codigo,nombre,marca,modelo,observacion
FILTRO-ACEITE-WIX51515,Filtro de aceite,WIX,Sedan 1.6,Nuevo
PASTILLA-FREN-D1060,Pastillas de freno delanteras,Bendix,Compacto,Nuevo
BUJIA-NGK-BKR6E,Bujia iridium,NGK,4 cil,Usado en perfectas condiciones
`;
