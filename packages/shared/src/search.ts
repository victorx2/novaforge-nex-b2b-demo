import type { ListingRow, SearchHit } from "./types";

/** Coincide código, nombre, marca o modelo (ej. filtro o bujia). */
export function listingMatchesQuery(
  listing: Pick<
    ListingRow,
    "part_number" | "name" | "brand" | "model"
  >,
  query: string,
): boolean {
  const qCompact = query.trim().toLowerCase().replace(/\s+/g, "");
  const qRaw = query.trim().toLowerCase();
  if (!qCompact) return false;

  const code = listing.part_number.toLowerCase().replace(/\s+/g, "");
  const name = listing.name.toLowerCase();
  const brand = listing.brand.toLowerCase();
  const model = listing.model
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/×/g, "x");

  if (code.includes(qCompact)) return true;
  if (model.includes(qCompact)) return true;
  if (name.includes(qRaw)) return true;
  if (brand.includes(qRaw)) return true;
  return false;
}

export function sortHitsByState(hits: SearchHit[]): SearchHit[] {
  return [...hits].sort((a, b) => {
    const s = a.dealer.state.localeCompare(b.dealer.state, "es");
    if (s !== 0) return s;
    return a.dealer.city.localeCompare(b.dealer.city, "es");
  });
}

export function formatEsNumber(n: number): string {
  return n.toLocaleString("es-VE");
}

export function formatRelativeUpdate(fromMs: number, now = Date.now()): string {
  const diff = Math.max(0, now - fromMs);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours < 48) {
    return rem > 0 ? `${hours}h ${rem}min` : `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 día" : `${days} días`;
}
