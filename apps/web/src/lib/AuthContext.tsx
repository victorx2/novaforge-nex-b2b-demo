import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  isAdminUser,
  type DealerProfile,
  type ListingInput,
  type ListingRow,
} from "@buscarepuesto/shared";
import {
  ensureDealerForUser,
  fetchDealerByUserId,
  fetchDealerListings,
  mergeDealerListings,
  replaceDealerListings,
  updateDealerProfile,
} from "./api";
import { requireSupabase, supabase, supabaseConfigured } from "./supabase";

type RegisterInput = {
  email: string;
  password: string;
  business_name: string;
  phone: string;
  address: string;
  state: string;
  city: string;
};

type Ctx = {
  configured: boolean;
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  sessionDealer: DealerProfile | null;
  sessionListings: ListingRow[];
  refreshSessionDealer: () => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  register: (input: RegisterInput) => Promise<string | null>;
  updateProfile: (
    patch: Partial<
      Pick<
        DealerProfile,
        "business_name" | "phone" | "address" | "state" | "city"
      >
    >,
  ) => Promise<string | null>;
  mergeListings: (incoming: ListingInput[]) => Promise<string | null>;
  clearListings: () => Promise<string | null>;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [sessionDealer, setSessionDealer] = useState<DealerProfile | null>(
    null,
  );
  const [sessionListings, setSessionListings] = useState<ListingRow[]>([]);

  const refreshSessionDealer = useCallback(async () => {
    if (!supabaseConfigured || !user) {
      setSessionDealer(null);
      setSessionListings([]);
      return;
    }
    let dealer = await fetchDealerByUserId(user.id);
    if (!dealer) {
      const meta = user.user_metadata ?? {};
      if (
        meta.business_name &&
        meta.phone &&
        meta.address &&
        meta.state &&
        meta.city
      ) {
        dealer = await ensureDealerForUser(user.id, {
          business_name: String(meta.business_name),
          phone: String(meta.phone),
          address: String(meta.address),
          state: String(meta.state),
          city: String(meta.city),
        });
      }
    }
    setSessionDealer(dealer);
    if (dealer) {
      const listings = await fetchDealerListings(dealer.id);
      setSessionListings(listings);
    } else {
      setSessionListings([]);
    }
  }, [user]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setSessionDealer(null);
      setSessionListings([]);
      return;
    }
    void refreshSessionDealer().catch(() => {
      setSessionDealer(null);
      setSessionListings([]);
    });
  }, [user, refreshSessionDealer]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const sb = requireSupabase();
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) return error.message;
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "Error al entrar.";
    }
  }, []);

  const logout = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSessionDealer(null);
    setSessionListings([]);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    try {
      const sb = requireSupabase();
      if (!input.email.trim()) return "Pon el email.";
      if (input.password.length < 6) return "Contraseña mínima 6 caracteres.";
      if (!input.business_name.trim()) return "Pon el nombre del negocio.";
      if (!input.phone.trim()) return "Pon el teléfono.";
      if (!input.address.trim()) return "Pon la dirección.";
      if (!input.state) return "Elige el estado.";
      if (!input.city.trim()) return "Pon la ciudad.";

      const { data, error } = await sb.auth.signUp({
        email: input.email.trim(),
        password: input.password,
        options: {
          data: {
            business_name: input.business_name.trim(),
            phone: input.phone.trim(),
            address: input.address.trim(),
            state: input.state,
            city: input.city.trim(),
          },
        },
      });
      if (error) return error.message;
      const uid = data.user?.id;
      if (!uid) {
        return "Revisa tu email para confirmar la cuenta, luego inicia sesión.";
      }

      if (data.session) {
        await ensureDealerForUser(uid, {
          business_name: input.business_name.trim(),
          phone: input.phone.trim(),
          address: input.address.trim(),
          state: input.state,
          city: input.city.trim(),
        });
      }
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "Error al registrarse.";
    }
  }, []);

  const updateProfile = useCallback(
    async (
      patch: Partial<
        Pick<
          DealerProfile,
          "business_name" | "phone" | "address" | "state" | "city"
        >
      >,
    ) => {
      if (!user || !sessionDealer) return "Debes iniciar sesión.";
      try {
        await updateDealerProfile(sessionDealer.id, patch);
        await refreshSessionDealer();
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Error al guardar.";
      }
    },
    [user, sessionDealer, refreshSessionDealer],
  );

  const mergeListings = useCallback(
    async (incoming: ListingInput[]) => {
      if (!user || !sessionDealer) return "Debes iniciar sesión.";
      try {
        await mergeDealerListings(sessionDealer.id, incoming);
        await refreshSessionDealer();
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Error al subir catálogo.";
      }
    },
    [user, sessionDealer, refreshSessionDealer],
  );

  const clearListings = useCallback(async () => {
    if (!user || !sessionDealer) return "Debes iniciar sesión.";
    try {
      await replaceDealerListings(sessionDealer.id, []);
      await refreshSessionDealer();
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "Error al vaciar.";
    }
  }, [user, sessionDealer, refreshSessionDealer]);

  const isAdmin = isAdminUser(user);

  const value = useMemo<Ctx>(
    () => ({
      configured: supabaseConfigured,
      loading,
      user,
      isAdmin,
      sessionDealer,
      sessionListings,
      refreshSessionDealer,
      login,
      logout,
      register,
      updateProfile,
      mergeListings,
      clearListings,
    }),
    [
      loading,
      user,
      isAdmin,
      sessionDealer,
      sessionListings,
      refreshSessionDealer,
      login,
      logout,
      register,
      updateProfile,
      mergeListings,
      clearListings,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): Ctx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}
