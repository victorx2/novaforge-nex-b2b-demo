import { SEED_DEALERS } from "../data/seedMarketplace";
import type { Dealer, Listing, SearchHit } from "./types";

const STORAGE_KEY = "busca-repuesto-dealers-v1";
const SESSION_KEY = "busca-repuesto-session";
const UPDATED_KEY = "busca-repuesto-updated-at";

export function loadDealers(): Dealer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Dealer[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return structuredClone(SEED_DEALERS);
}

export function saveDealers(dealers: Dealer[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dealers));
    localStorage.setItem(UPDATED_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function getLastUpdatedAt(): number {
  try {
    const raw = localStorage.getItem(UPDATED_KEY);
    if (raw) {
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) return n;
    }
  } catch {
    /* ignore */
  }
  return Date.now();
}

export function resetDealers(): Dealer[] {
  const dealers = structuredClone(SEED_DEALERS);
  saveDealers(dealers);
  return dealers;
}

export function getSessionDealerId(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setSessionDealerId(id: string | null): void {
  try {
    if (id) sessionStorage.setItem(SESSION_KEY, id);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function publicDealer(d: Dealer): SearchHit["dealer"] {
  return {
    id: d.id,
    businessName: d.businessName,
    phone: d.phone,
    address: d.address,
    state: d.state,
    city: d.city,
  };
}

/**
 * Busca por código, nombre, marca o modelo (ej. 6205 o 25x52x15).
 * Opcional: filtrar por estado. Prioriza el estado elegido al ordenar.
 */
export function searchMarketplace(
  dealers: Dealer[],
  query: string,
  stateFilter: string,
): SearchHit[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, "");
  if (!q) return [];

  const hits: SearchHit[] = [];

  for (const dealer of dealers) {
    if (stateFilter && dealer.state !== stateFilter) continue;

    for (const listing of dealer.listings) {
      if (matchesListing(listing, q, query.trim().toLowerCase())) {
        hits.push({ listing, dealer: publicDealer(dealer) });
      }
    }
  }

  // Si hay filtro vacío y el usuario está buscando a nivel nacional,
  // ya están todos. Si más adelante hay preferencia de estado, se puede
  // reordenar aquí; por ahora orden alfabético por estado + ciudad.
  hits.sort((a, b) => {
    const s = a.dealer.state.localeCompare(b.dealer.state, "es");
    if (s !== 0) return s;
    return a.dealer.city.localeCompare(b.dealer.city, "es");
  });

  return hits;
}

function matchesListing(listing: Listing, qCompact: string, qRaw: string): boolean {
  const code = listing.part_number.toLowerCase().replace(/\s+/g, "");
  const name = listing.name.toLowerCase();
  const brand = listing.brand.toLowerCase();
  const model = listing.model.toLowerCase().replace(/\s+/g, "").replace(/×/g, "x");

  if (code.includes(qCompact)) return true;
  if (model.includes(qCompact)) return true;
  if (name.includes(qRaw)) return true;
  if (brand.includes(qRaw)) return true;

  // 25x52x15 dentro del modelo
  const dim = qCompact.match(/^(\d+(?:\.\d+)?)[x×*](\d+(?:\.\d+)?)[x×*](\d+(?:\.\d+)?)$/i);
  if (dim && model.includes(qCompact.replace(/×/g, "x"))) return true;

  return false;
}

/** Merge por part_number + brand + observation (reemplaza o agrega). */
export function mergeListings(
  current: Listing[],
  incoming: Listing[],
): Listing[] {
  const map = new Map<string, Listing>();
  const keyOf = (l: Listing) =>
    `${l.part_number.toUpperCase()}|${l.brand.toUpperCase()}|${l.observation.toUpperCase()}`;

  for (const l of current) map.set(keyOf(l), { ...l });
  for (const l of incoming) {
    map.set(keyOf(l), { ...l });
  }
  return Array.from(map.values()).sort((a, b) =>
    a.part_number.localeCompare(b.part_number, "es"),
  );
}

export function newDealerId(): string {
  return `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
