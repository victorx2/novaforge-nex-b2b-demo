import { useState } from "react";
import { PasswordGate } from "./components/PasswordGate";
import { MarketplaceProvider } from "./lib/MarketplaceContext";
import { Buscar } from "./pages/Buscar";
import { Repuestero } from "./pages/Repuestero";

type Page = "buscar" | "repuestero";

function Shell() {
  const [page, setPage] = useState<Page>("buscar");

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
                Encuentra la pieza · llama al local
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
          </button>
        </div>
      </nav>

      <main className="main">
        {page === "buscar" ? <Buscar /> : <Repuestero />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PasswordGate>
      <MarketplaceProvider>
        <Shell />
      </MarketplaceProvider>
    </PasswordGate>
  );
}
