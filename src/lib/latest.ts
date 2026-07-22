import type { Dealer, SearchHit } from "./types";
import { publicDealer } from "./marketplace";

/** Últimos listados: recorre locales de atrás hacia adelante (los “recién” del seed). */
export function getLatestListings(
  dealers: Dealer[],
  limit = 12,
): SearchHit[] {
  const hits: SearchHit[] = [];
  for (let i = dealers.length - 1; i >= 0; i--) {
    const d = dealers[i];
    for (let j = d.listings.length - 1; j >= 0; j--) {
      hits.push({ listing: d.listings[j], dealer: publicDealer(d) });
      if (hits.length >= limit) return hits;
    }
  }
  return hits;
}
