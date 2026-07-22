import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Dealer, Listing } from "./types";
import {
  getSessionDealerId,
  loadDealers,
  mergeListings,
  newDealerId,
  resetDealers,
  saveDealers,
  setSessionDealerId,
} from "./marketplace";

type Ctx = {
  dealers: Dealer[];
  sessionDealer: Dealer | null;
  login: (phone: string, pin: string) => string | null;
  logout: () => void;
  register: (input: {
    businessName: string;
    phone: string;
    address: string;
    state: string;
    city: string;
    pin: string;
  }) => string | null;
  updateSessionProfile: (
    patch: Partial<Omit<Dealer, "id" | "listings" | "pin">>,
  ) => void;
  setSessionListings: (listings: Listing[]) => void;
  mergeSessionListings: (incoming: Listing[]) => void;
  resetDemo: () => void;
};

const MarketplaceContext = createContext<Ctx | null>(null);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [dealers, setDealers] = useState<Dealer[]>(() => loadDealers());
  const [sessionId, setSessionId] = useState<string | null>(() =>
    getSessionDealerId(),
  );

  useEffect(() => {
    saveDealers(dealers);
  }, [dealers]);

  const sessionDealer = useMemo(
    () => dealers.find((d) => d.id === sessionId) ?? null,
    [dealers, sessionId],
  );

  const login = useCallback((phone: string, pin: string) => {
    const normalized = phone.replace(/\s+/g, "");
    let error: string | null = "Teléfono o PIN incorrectos.";
    setDealers((prev) => {
      const d = prev.find(
        (x) => x.phone.replace(/\s+/g, "") === normalized && x.pin === pin,
      );
      if (d) {
        error = null;
        setSessionId(d.id);
        setSessionDealerId(d.id);
      }
      return prev;
    });
    return error;
  }, []);

  const logout = useCallback(() => {
    setSessionId(null);
    setSessionDealerId(null);
  }, []);

  const register = useCallback(
    (input: {
      businessName: string;
      phone: string;
      address: string;
      state: string;
      city: string;
      pin: string;
    }) => {
      const phone = input.phone.trim();
      if (!input.businessName.trim()) return "Pon el nombre del negocio.";
      if (!phone) return "Pon el teléfono.";
      if (!input.address.trim()) return "Pon la dirección.";
      if (!input.state) return "Elige el estado.";
      if (!input.city.trim()) return "Pon la ciudad.";
      if (input.pin.length < 4) return "PIN de al menos 4 dígitos.";

      const normalized = phone.replace(/\s+/g, "");
      const id = newDealerId();
      let failed = false;

      setDealers((prev) => {
        if (prev.some((d) => d.phone.replace(/\s+/g, "") === normalized)) {
          failed = true;
          return prev;
        }
        const dealer: Dealer = {
          id,
          businessName: input.businessName.trim(),
          phone,
          address: input.address.trim(),
          state: input.state,
          city: input.city.trim(),
          pin: input.pin,
          listings: [],
        };
        return [...prev, dealer];
      });

      if (failed) return "Ese teléfono ya está registrado.";
      setSessionId(id);
      setSessionDealerId(id);
      return null;
    },
    [],
  );

  const updateSessionProfile = useCallback(
    (patch: Partial<Omit<Dealer, "id" | "listings" | "pin">>) => {
      if (!sessionId) return;
      setDealers((prev) =>
        prev.map((d) => (d.id === sessionId ? { ...d, ...patch } : d)),
      );
    },
    [sessionId],
  );

  const setSessionListings = useCallback(
    (listings: Listing[]) => {
      if (!sessionId) return;
      setDealers((prev) =>
        prev.map((d) => (d.id === sessionId ? { ...d, listings } : d)),
      );
    },
    [sessionId],
  );

  const mergeSessionListings = useCallback(
    (incoming: Listing[]) => {
      if (!sessionId) return;
      setDealers((prev) =>
        prev.map((d) =>
          d.id === sessionId
            ? { ...d, listings: mergeListings(d.listings, incoming) }
            : d,
        ),
      );
    },
    [sessionId],
  );

  const resetDemo = useCallback(() => {
    const next = resetDealers();
    setDealers(next);
    setSessionId(null);
    setSessionDealerId(null);
  }, []);

  const value: Ctx = {
    dealers,
    sessionDealer,
    login,
    logout,
    register,
    updateSessionProfile,
    setSessionListings,
    mergeSessionListings,
    resetDemo,
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace(): Ctx {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace outside provider");
  return ctx;
}
