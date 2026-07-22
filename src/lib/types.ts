export type InventoryItem = {
  part_number: string;
  description: string;
  brand: string;
  bore?: number;
  od?: number;
  width?: number;
  qty: number;
  location: string;
};
