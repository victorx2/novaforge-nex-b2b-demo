import type { DealerImportRow, ListingImportByDealer } from "./types";
import { normalizePhoneKey } from "./phone";

/**
 * CSV locales (operador):
 * negocio,telefono,direccion,estado,ciudad
 */
export function parseDealersCsv(text: string): DealerImportRow[] {
  const { dataRows, header, hasHeader } = parseTable(text);
  if (dataRows.length === 0) return [];

  const col = hasHeader
    ? {
        business: indexOf(header, [
          "negocio",
          "business_name",
          "nombre",
          "local",
          "empresa",
        ]),
        phone: indexOf(header, ["telefono", "phone", "celular", "whatsapp"]),
        address: indexOf(header, [
          "direccion",
          "address",
          "dir",
          "ubicacion",
        ]),
        state: indexOf(header, ["estado", "state"]),
        city: indexOf(header, ["ciudad", "city"]),
      }
    : { business: 0, phone: 1, address: 2, state: 3, city: 4 };

  if (col.business < 0 || col.phone < 0) {
    throw new Error(
      "CSV de locales sin columnas negocio/telefono (o business_name/phone).",
    );
  }

  const out: DealerImportRow[] = [];
  for (const row of dataRows) {
    const business_name = (row[col.business] ?? "").trim();
    const phone = (row[col.phone] ?? "").trim();
    if (!business_name || !phone) continue;
    out.push({
      business_name,
      phone,
      address:
        (col.address >= 0 ? row[col.address] : "")?.trim() || "Sin dirección",
      state: (col.state >= 0 ? row[col.state] : "")?.trim() || "Carabobo",
      city: (col.city >= 0 ? row[col.city] : "")?.trim() || "",
    });
  }
  return out;
}

/**
 * CSV catálogo con local (operador):
 * telefono (o negocio),codigo,nombre,marca,modelo,observacion
 */
export function parseCatalogByDealerCsv(text: string): ListingImportByDealer[] {
  const { dataRows, header, hasHeader } = parseTable(text);
  if (dataRows.length === 0) return [];

  const col = hasHeader
    ? {
        phone: indexOf(header, ["telefono", "phone", "celular", "whatsapp"]),
        business: indexOf(header, [
          "negocio",
          "business_name",
          "local",
          "empresa",
        ]),
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
    : {
        phone: 0,
        business: -1,
        code: 1,
        name: 2,
        brand: 3,
        model: 4,
        obs: 5,
      };

  if (col.code < 0) {
    throw new Error("CSV sin columna de código (codigo / part_number).");
  }
  if (col.phone < 0 && col.business < 0) {
    throw new Error(
      "CSV de catálogo necesita telefono o negocio para enlazar el local.",
    );
  }

  const out: ListingImportByDealer[] = [];
  for (const row of dataRows) {
    const part_number = (row[col.code] ?? "").trim();
    if (!part_number) continue;
    const phone = (col.phone >= 0 ? row[col.phone] : "")?.trim() || "";
    const business_name =
      (col.business >= 0 ? row[col.business] : "")?.trim() || "";
    if (!phone && !business_name) continue;
    out.push({
      phone,
      business_name,
      part_number,
      name: (col.name >= 0 ? row[col.name] : "")?.trim() || part_number,
      brand: (col.brand >= 0 ? row[col.brand] : "")?.trim() || "—",
      model: (col.model >= 0 ? row[col.model] : "")?.trim() || "",
      observation: (col.obs >= 0 ? row[col.obs] : "")?.trim() || "Nuevo",
    });
  }
  return out;
}

export function dealerMatchKey(row: {
  phone?: string;
  business_name?: string;
}): string {
  const phoneKey = row.phone ? normalizePhoneKey(row.phone) : "";
  if (phoneKey) return `p:${phoneKey}`;
  const name = (row.business_name ?? "").trim().toLowerCase();
  return name ? `n:${name}` : "";
}

export const DEALERS_CSV_TEMPLATE = `negocio,telefono,direccion,estado,ciudad
Auto Partes El Centro,0412-5550101,Calle Constitucion Local 12,Carabobo,Valencia
Repuestos Cagua Express,0414-5550202,Av Principal Galpon 3,Aragua,Cagua
`;

export const CATALOG_BY_DEALER_CSV_TEMPLATE = `telefono,codigo,nombre,marca,modelo,observacion
0412-5550101,FILTRO-ACEITE-WIX51515,Filtro de aceite,WIX,Sedan 1.6,Nuevo
0414-5550202,BUJIA-NGK-BKR6E,Bujia iridium,NGK,4 cil,Nuevo
`;

function parseTable(text: string): {
  dataRows: string[][];
  header: string[];
  hasHeader: boolean;
} {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) {
    return { dataRows: [], header: [], hasHeader: false };
  }
  const rows = lines.map(splitCsvLine);
  const header = rows[0].map((h) => normalizeHeader(h));
  const hasHeader = header.some((h) =>
    [
      "codigo",
      "part_number",
      "nombre",
      "name",
      "marca",
      "brand",
      "negocio",
      "business_name",
      "telefono",
      "phone",
      "estado",
      "state",
    ].includes(h),
  );
  return {
    dataRows: hasHeader ? rows.slice(1) : rows,
    header,
    hasHeader,
  };
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
