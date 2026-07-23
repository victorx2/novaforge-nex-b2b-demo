import type {
  DealerImportRow,
  DealerProfile,
  ListingImportByDealer,
  ListingInput,
  ListingRow,
  SearchHit,
} from "@buscarepuesto/shared";
import {
  dealerMatchKey,
  normalizePhoneKey,
  sortHitsByState,
} from "@buscarepuesto/shared";
import { requireSupabase } from "./supabase";

type ListingJoin = ListingRow & {
  dealers: DealerProfile | DealerProfile[] | null;
};

function mapDealer(row: DealerProfile): DealerProfile {
  return {
    id: row.id,
    user_id: row.user_id ?? null,
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
  return Array.isArray(d) ? (d[0] ?? null) : d;
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

export async function fetchDealerByUserId(
  userId: string,
): Promise<DealerProfile | null> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from("dealers")
    .select("*")
    .eq("user_id", userId)
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

  // Evitar romper el parser PostgREST (.or) con comas/paréntesis
  const safe = q.replace(/[,()]/g, " ").trim();
  if (!safe) return [];
  const pattern = `%${safe}%`;
  let req = sb
    .from("listings")
    .select("*, dealers!inner(*)")
    .or(
      `part_number.ilike."${pattern}",name.ilike."${pattern}",brand.ilike."${pattern}",model.ilike."${pattern}"`,
    )
    .limit(200);

  if (stateFilter) {
    req = req.eq("dealers.state", stateFilter);
  }

  const { data, error } = await req;
  if (error) throw error;
  return sortHitsByState(toHits((data ?? []) as ListingJoin[]));
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

/** Crea o actualiza el perfil del usuario autenticado (self-serve). */
export async function ensureDealerForUser(
  userId: string,
  profile: Omit<DealerProfile, "id" | "created_at" | "updated_at" | "user_id">,
): Promise<DealerProfile> {
  const existing = await fetchDealerByUserId(userId);
  const sb = requireSupabase();
  if (existing) {
    const { error } = await sb
      .from("dealers")
      .update({
        business_name: profile.business_name,
        phone: profile.phone,
        address: profile.address,
        state: profile.state,
        city: profile.city,
      })
      .eq("id", existing.id);
    if (error) throw error;
    return (await fetchDealer(existing.id))!;
  }
  const { data, error } = await sb
    .from("dealers")
    .insert({
      user_id: userId,
      business_name: profile.business_name,
      phone: profile.phone,
      address: profile.address,
      state: profile.state,
      city: profile.city,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapDealer(data);
}

export async function updateDealerProfile(
  dealerId: string,
  patch: Partial<
    Pick<
      DealerProfile,
      "business_name" | "phone" | "address" | "state" | "city"
    >
  >,
): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from("dealers").update(patch).eq("id", dealerId);
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

/** Operador: upsert locales por teléfono (sin cuenta auth). */
export async function adminUpsertDealers(
  rows: DealerImportRow[],
): Promise<{ created: number; updated: number }> {
  const sb = requireSupabase();
  const existing = await fetchAllDealers();
  const byKey = new Map<string, DealerProfile>();
  for (const d of existing) {
    const k = dealerMatchKey({ phone: d.phone, business_name: d.business_name });
    if (k) byKey.set(k, d);
  }

  let created = 0;
  let updated = 0;
  for (const row of rows) {
    const key = dealerMatchKey(row);
    if (!key) continue;
    const hit = byKey.get(key);
    if (hit) {
      const { error } = await sb
        .from("dealers")
        .update({
          business_name: row.business_name,
          phone: row.phone,
          address: row.address,
          state: row.state,
          city: row.city || hit.city,
        })
        .eq("id", hit.id);
      if (error) throw error;
      updated++;
      byKey.set(key, { ...hit, ...row });
    } else {
      const { data, error } = await sb
        .from("dealers")
        .insert({
          business_name: row.business_name,
          phone: row.phone,
          address: row.address,
          state: row.state,
          city: row.city || row.state,
          user_id: null,
        })
        .select("*")
        .single();
      if (error) throw error;
      created++;
      byKey.set(key, mapDealer(data));
    }
  }
  return { created, updated };
}

/** Operador: merge catálogo enlazando por teléfono o nombre. */
export async function adminMergeListingsByDealer(
  rows: ListingImportByDealer[],
): Promise<{ dealersTouched: number; itemsMerged: number; skipped: number }> {
  const existing = await fetchAllDealers();
  const byKey = new Map<string, DealerProfile>();
  for (const d of existing) {
    const pk = normalizePhoneKey(d.phone);
    if (pk) byKey.set(`p:${pk}`, d);
    const nk = d.business_name.trim().toLowerCase();
    if (nk) byKey.set(`n:${nk}`, d);
  }

  const grouped = new Map<string, ListingInput[]>();
  let skipped = 0;
  for (const row of rows) {
    const key = dealerMatchKey(row);
    const dealer = key ? byKey.get(key) : undefined;
    if (!dealer) {
      skipped++;
      continue;
    }
    const list = grouped.get(dealer.id) ?? [];
    list.push({
      part_number: row.part_number,
      name: row.name,
      brand: row.brand,
      model: row.model,
      observation: row.observation,
    });
    grouped.set(dealer.id, list);
  }

  let itemsMerged = 0;
  for (const [dealerId, items] of grouped) {
    await mergeDealerListings(dealerId, items);
    itemsMerged += items.length;
  }

  return {
    dealersTouched: grouped.size,
    itemsMerged,
    skipped,
  };
}

export async function adminClearDealerListings(dealerId: string): Promise<void> {
  await replaceDealerListings(dealerId, []);
}
