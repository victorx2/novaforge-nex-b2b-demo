import type {
  DealerProfile,
  ListingInput,
  ListingRow,
  SearchHit,
} from "@buscarepuesto/shared";
import { listingMatchesQuery, sortHitsByState } from "@buscarepuesto/shared";
import { requireSupabase } from "./supabase";

type ListingJoin = ListingRow & {
  dealers: DealerProfile | DealerProfile[] | null;
};

function mapDealer(row: DealerProfile): DealerProfile {
  return {
    id: row.id,
    business_name: row.business_name,
    phone: row.phone,
    address: row.address,
    state: row.state,
    city: row.city,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function unwrapDealer(
  d: DealerProfile | DealerProfile[] | null,
): DealerProfile | null {
  if (!d) return null;
  return Array.isArray(d) ? d[0] ?? null : d;
}

export async function fetchAllDealers(): Promise<DealerProfile[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("dealers")
    .select("*")
    .order("business_name");
  if (error) throw error;
  return (data ?? []).map(mapDealer);
}

export async function fetchDealer(id: string): Promise<DealerProfile | null> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("dealers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapDealer(data) : null;
}

export async function fetchDealerListings(
  dealerId: string,
): Promise<ListingRow[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("listings")
    .select("*")
    .eq("dealer_id", dealerId)
    .order("part_number");
  if (error) throw error;
  return (data ?? []) as ListingRow[];
}

export async function fetchLatestListings(limit = 12): Promise<SearchHit[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("listings")
    .select("*, dealers(*)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return toHits((data ?? []) as ListingJoin[]);
}

export async function searchListings(
  query: string,
  stateFilter: string,
): Promise<SearchHit[]> {
  const sb = requireSupabase();
  const q = query.trim();
  if (!q) return [];

  const { data, error } = await sb
    .from("listings")
    .select("*, dealers(*)")
    .limit(500);
  if (error) throw error;

  let hits = toHits((data ?? []) as ListingJoin[]).filter((h) =>
    listingMatchesQuery(h.listing, q),
  );
  if (stateFilter) {
    hits = hits.filter((h) => h.dealer.state === stateFilter);
  }
  return sortHitsByState(hits);
}

export async function fetchDirectoryStats(): Promise<{
  dealers: number;
  listings: number;
  codes: number;
  states: number;
  withListings: number;
  lastUpdatedMs: number;
}> {
  const sb = requireSupabase();
  const [dealersRes, listingsRes] = await Promise.all([
    sb.from("dealers").select("id, state, updated_at"),
    sb.from("listings").select("part_number, dealer_id, created_at"),
  ]);
  if (dealersRes.error) throw dealersRes.error;
  if (listingsRes.error) throw listingsRes.error;

  const dealers = dealersRes.data ?? [];
  const listings = listingsRes.data ?? [];
  const codes = new Set(listings.map((l) => l.part_number.toUpperCase()));
  const states = new Set(dealers.map((d) => d.state).filter(Boolean));
  const dealersWith = new Set(listings.map((l) => l.dealer_id));
  let last = 0;
  for (const d of dealers) {
    const t = d.updated_at ? Date.parse(d.updated_at) : 0;
    if (t > last) last = t;
  }
  for (const l of listings) {
    const t = l.created_at ? Date.parse(l.created_at) : 0;
    if (t > last) last = t;
  }

  return {
    dealers: dealers.length,
    listings: listings.length,
    codes: codes.size,
    states: states.size,
    withListings: dealersWith.size,
    lastUpdatedMs: last || Date.now(),
  };
}

function toHits(rows: ListingJoin[]): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const row of rows) {
    const dealer = unwrapDealer(row.dealers);
    if (!dealer) continue;
    hits.push({
      listing: {
        id: row.id,
        dealer_id: row.dealer_id,
        part_number: row.part_number,
        name: row.name,
        brand: row.brand,
        model: row.model,
        observation: row.observation,
        created_at: row.created_at,
      },
      dealer: mapDealer(dealer),
    });
  }
  return hits;
}

export async function upsertDealerProfile(
  profile: Omit<DealerProfile, "created_at" | "updated_at">,
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from("dealers").upsert({
    id: profile.id,
    business_name: profile.business_name,
    phone: profile.phone,
    address: profile.address,
    state: profile.state,
    city: profile.city,
  });
  if (error) throw error;
}

export async function updateDealerProfile(
  id: string,
  patch: Partial<
    Pick<
      DealerProfile,
      "business_name" | "phone" | "address" | "state" | "city"
    >
  >,
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from("dealers").update(patch).eq("id", id);
  if (error) throw error;
}

export async function replaceDealerListings(
  dealerId: string,
  items: ListingInput[],
): Promise<void> {
  const sb = requireSupabase();
  const { error: delErr } = await sb
    .from("listings")
    .delete()
    .eq("dealer_id", dealerId);
  if (delErr) throw delErr;
  if (items.length === 0) return;
  const { error } = await sb.from("listings").insert(
    items.map((it) => ({
      dealer_id: dealerId,
      part_number: it.part_number,
      name: it.name,
      brand: it.brand,
      model: it.model,
      observation: it.observation,
    })),
  );
  if (error) throw error;
}

export async function mergeDealerListings(
  dealerId: string,
  incoming: ListingInput[],
): Promise<void> {
  const current = await fetchDealerListings(dealerId);
  const map = new Map<string, ListingInput>();
  const keyOf = (l: ListingInput) =>
    `${l.part_number.toUpperCase()}|${l.brand.toUpperCase()}|${l.observation.toUpperCase()}`;
  for (const l of current) map.set(keyOf(l), l);
  for (const l of incoming) map.set(keyOf(l), l);
  await replaceDealerListings(dealerId, Array.from(map.values()));
}
