import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { InventoryItem } from "./types";
import { loadInventory, saveInventory } from "./inventory";

type Ctx = {
  items: InventoryItem[];
  setItems: (
    items: InventoryItem[] | ((prev: InventoryItem[]) => InventoryItem[]),
  ) => void;
};

const InventoryContext = createContext<Ctx | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItemsState] = useState<InventoryItem[]>(() => loadInventory());

  useEffect(() => {
    saveInventory(items);
  }, [items]);

  const setItems = useCallback(
    (next: InventoryItem[] | ((prev: InventoryItem[]) => InventoryItem[])) => {
      setItemsState(next);
    },
    [],
  );

  return (
    <InventoryContext.Provider value={{ items, setItems }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): Ctx {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory outside provider");
  return ctx;
}
