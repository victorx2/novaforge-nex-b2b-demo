import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { Buscar } from "./pages/Buscar";
import { Operador } from "./pages/Operador";
import { Repuestero } from "./pages/Repuestero";

type Page = "buscar" | "repuestero" | "operador";

function Shell() {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState<Page>(() =>
    typeof window !== "undefined" && window.location.hash === "#operador"
      ? "operador"
      : "buscar",
  );

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#operador") setPage("operador");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (page === "operador") {
      if (window.location.hash !== "#operador") {
        window.location.hash = "operador";
      }
    } else if (window.location.hash === "#operador") {
      history.replaceState(null, "", window.location.pathname);
    }
  }, [page]);

  const showOperadorTab = isAdmin || page === "operador";

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header-inner">
          <div className="brand-block">
            <div className="brand-logo" aria-hidden>
              <span>B</span>
            </div>
            <div className="brand-text">
              <div className="brand-name">BuscaRepuesto</div>
              <div className="brand-tagline">
                Automotriz · 100% gratis · llama al local
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="tabs" aria-label="Secciones">
        <div className="tabs-inner">
          <button
            type="button"
            className={page === "buscar" ? "tab active" : "tab"}
            onClick={() => setPage("buscar")}
          >
            Buscar
          </button>
          <button
            type="button"
            className={page === "repuestero" ? "tab active" : "tab"}
            onClick={() => setPage("repuestero")}
          >
            Soy repuestero
            <span className="tab-sub"> · gratis</span>
          </button>
          {showOperadorTab && (
            <button
              type="button"
              className={page === "operador" ? "tab active" : "tab"}
              onClick={() => setPage("operador")}
            >
              Operador
            </button>
          )}
        </div>
      </nav>

      <main className="main">
        {page === "buscar" ? (
          <Buscar />
        ) : page === "repuestero" ? (
          <Repuestero />
        ) : (
          <Operador />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
