export type ListingInput = {
  part_number: string;
  name: string;
  brand: string;
  model: string;
  observation: string;
};

export type DealerPublic = {
  id: string;
  business_name: string;
  phone: string;
  address: string;
  state: string;
  city: string;
};

export type ListingRow = ListingInput & {
  id: string;
  dealer_id: string;
  created_at?: string;
};

export type SearchHit = {
  listing: ListingRow;
  dealer: DealerPublic;
};

export type DealerProfile = DealerPublic & {
  user_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type DealerImportRow = {
  business_name: string;
  phone: string;
  address: string;
  state: string;
  city: string;
};

export type ListingImportByDealer = ListingInput & {
  phone: string;
  business_name: string;
};
