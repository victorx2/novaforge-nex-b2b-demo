export type Listing = {
  part_number: string;
  name: string;
  brand: string;
  model: string;
  observation: string;
};

export type Dealer = {
  id: string;
  businessName: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  /** Demo-only; not shown publicly */
  pin: string;
  listings: Listing[];
};

/** Resultado público: pieza + dónde llamarla (sin precio). */
export type SearchHit = {
  listing: Listing;
  dealer: Omit<Dealer, "pin" | "listings">;
};
