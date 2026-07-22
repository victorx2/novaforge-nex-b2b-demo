import type { InventoryItem } from "./types";
import { SEED_ITEMS } from "../data/seed";

const STORAGE_KEY = "nex-fase-a-inventory";

export function loadInventory(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as InventoryItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return structuredClone(SEED_ITEMS);
}

export function saveInventory(items: InventoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function resetInventory(): InventoryItem[] {
  const items = structuredClone(SEED_ITEMS);
  saveInventory(items);
  return items;
}

/** Busca por código, marca, descripción o medida tipo 25x52x15 */
export function searchInventory(
  items: InventoryItem[],
  query: string,
): InventoryItem[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, "");
  if (!q) return [];

  const dimMatch = q.match(/^(\d+(?:\.\d+)?)[x×*](\d+(?:\.\d+)?)[x×*](\d+(?:\.\d+)?)$/i);

  return items.filter((item) => {
    const code = item.part_number.toLowerCase().replace(/\s+/g, "");
    const desc = item.description.toLowerCase();
    const brand = item.brand.toLowerCase();

    if (code.includes(q) || desc.includes(q) || brand.includes(query.trim().toLowerCase())) {
      return true;
    }

    if (dimMatch && item.bore != null && item.od != null && item.width != null) {
      const [, b, o, w] = dimMatch;
      const bore = Number(b);
      const od = Number(o);
      const width = Number(w);
      return (
        approx(item.bore, bore) &&
        approx(item.od, od) &&
        approx(item.width, width)
      );
    }

    return false;
  });
}

function approx(a: number, b: number, tol = 0.15): boolean {
  return Math.abs(a - b) <= tol;
}

/** Merge por part_number: CSV gana en qty/location/description si vienen. */
export function mergeInventory(
  current: InventoryItem[],
  incoming: InventoryItem[],
): InventoryItem[] {
  const map = new Map<string, InventoryItem>();
  for (const item of current) {
    map.set(item.part_number.toUpperCase(), { ...item });
  }
  for (const item of incoming) {
    const key = item.part_number.toUpperCase();
    const prev = map.get(key);
    if (prev) {
      map.set(key, {
        ...prev,
        ...item,
        part_number: prev.part_number,
        qty: item.qty,
        location: item.location || prev.location,
        description: item.description || prev.description,
        brand: item.brand || prev.brand,
      });
    } else {
      map.set(key, item);
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.part_number.localeCompare(b.part_number, "es"),
  );
}
