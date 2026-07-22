import { useState } from "react";
import { PasswordGate } from "./components/PasswordGate";
import { InventoryProvider } from "./lib/InventoryContext";
import { Buscar } from "./pages/Buscar";
import { MiStock } from "./pages/MiStock";

type Page = "buscar" | "stock";

export default function App() {
  const [page, setPage] = useState<Page>("buscar");

  return (
    <PasswordGate>
      <InventoryProvider>
        <div className="app">
          <header className="topbar">
            <div className="brand">
              <span className="brand-mark">NEX</span>
              <span className="brand-sub">Fase A · Buscar + Stock</span>
            </div>
            <nav className="nav">
              <button
                type="button"
                className={page === "buscar" ? "nav-btn active" : "nav-btn"}
                onClick={() => setPage("buscar")}
              >
                Buscar
              </button>
              <button
                type="button"
                className={page === "stock" ? "nav-btn active" : "nav-btn"}
                onClick={() => setPage("stock")}
              >
                Mi stock
              </button>
            </nav>
            <a className="portfolio-link" href="/portfolio/" title="Maqueta ecosistema completa">
              Portafolio
            </a>
          </header>
          <main className="main">
            {page === "buscar" ? <Buscar /> : <MiStock />}
          </main>
        </div>
      </InventoryProvider>
    </PasswordGate>
  );
}
