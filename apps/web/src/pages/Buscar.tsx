import { useState } from "react";
import type { SearchHit } from "@buscarepuesto/shared";
import { STATES } from "@buscarepuesto/shared";
import { BearingVisual } from "../components/BearingVisual";
import { DealerCatalog } from "../components/DealerCatalog";
import { DirectoryStats } from "../components/DirectoryStats";
import { LatestListings } from "../components/LatestListings";
import { SetupBanner } from "../components/SetupBanner";
import { searchListings } from "../lib/api";
import { useAuth } from "../lib/AuthContext";
import { supabaseConfigured } from "../lib/supabase";

export function Buscar() {
  const { configured } = useAuth();
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [submittedState, setSubmittedState] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const [catalogDealerId, setCatalogDealerId] = useState<string | null>(null);
  const [catalogHighlight, setCatalogHighlight] = useState("");

  async function runSearch(q: string, state: string) {
    setCatalogDealerId(null);
    setQuery(q);
    setStateFilter(state);
    setSubmitted(q.trim());
    setSubmittedState(state);
    setSearchErr("");
    if (!q.trim() || !supabaseConfigured) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const hits = await searchListings(q.trim(), state);
      setResults(hits);
    } catch (e) {
      setResults([]);
      setSearchErr(e instanceof Error ? e.message : "Error al buscar");
    } finally {
      setSearching(false);
    }
  }

  function openDealer(dealerId: string, code?: string) {
    setCatalogDealerId(dealerId);
    setCatalogHighlight(code ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (catalogDealerId) {
    return (
      <DealerCatalog
        dealerId={catalogDealerId}
        highlightCode={catalogHighlight || submitted}
        onBack={() => setCatalogDealerId(null)}
      />
    );
  }

  return (
    <section className="search-page">
      {!configured && <SetupBanner />}

      <div className="search-hero">
        <h1>¿Qué rodamiento buscas?</h1>
        <p>
          Escribe el código. Te mostramos en qué locales lo tienen. Toca un
          local para ver <strong>todo su catálogo de rodamientos</strong>. El
          precio lo cuadran por teléfono.
        </p>

        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            void runSearch(query, stateFilter);
          }}
        >
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej. 6205-2RS o 25x52x15"
            autoFocus
            disabled={!configured}
          />
          <select
            className="state-select"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            aria-label="Filtrar por estado"
            disabled={!configured}
          >
            <option value="">Todo el país</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary" disabled={!configured}>
            {searching ? "…" : "Buscar"}
          </button>
        </form>

        {!submitted && configured && (
          <p className="hint">
            Prueba:{" "}
            <button
              type="button"
              className="linkish"
              onClick={() => void runSearch("6205", "")}
            >
              6205
            </button>{" "}
            en todo el país, o{" "}
            <button
              type="button"
              className="linkish"
              onClick={() => void runSearch("6205", "Carabobo")}
            >
              6205 en Carabobo
            </button>
          </p>
        )}
      </div>

      <DirectoryStats />

      {!submitted && <LatestListings onOpenDealer={openDealer} />}

      {searchErr && <p className="bad">{searchErr}</p>}

      {submitted && (
        <p className="results-meta">
          {searching
            ? "Buscando…"
            : `${results.length} resultado${results.length === 1 ? "" : "s"} para `}
          {!searching && <strong>{submitted}</strong>}
          {!searching &&
            (submittedState ? ` · ${submittedState}` : " · nacional")}
          {" · "}
          <button
            type="button"
            className="linkish"
            onClick={() => {
              setSubmitted("");
              setSubmittedState("");
              setQuery("");
              setResults([]);
            }}
          >
            Ver últimos listados
          </button>
        </p>
      )}

      {submitted && !searching && results.length === 0 && !searchErr && (
        <div className="empty">
          Nadie tiene listado <strong>{submitted}</strong>
          {submittedState ? ` en ${submittedState}` : ""}.
        </div>
      )}

      {results.length > 0 && (
        <div className="hits-grid">
          {results.map((hit) => (
            <article
              className="hit-card hit-card-media hit-card-clickable"
              key={hit.listing.id}
            >
              <button
                type="button"
                className="hit-open"
                onClick={() =>
                  openDealer(hit.dealer.id, hit.listing.part_number)
                }
              >
                <BearingVisual
                  partNumber={hit.listing.part_number}
                  brand={hit.listing.brand}
                />
                <div className="hit-body">
                  <div className="hit-code">{hit.listing.part_number}</div>
                  <div className="hit-name">{hit.listing.name}</div>
                  <div className="hit-meta">
                    <span>{hit.listing.brand}</span>
                    {hit.listing.model && <span>· {hit.listing.model}</span>}
                  </div>
                  <div className="hit-obs">{hit.listing.observation}</div>
                  <div className="hit-place">
                    <strong>{hit.dealer.state}</strong> · {hit.dealer.city}
                  </div>
                  <div className="hit-address">{hit.dealer.address}</div>
                  <div className="hit-biz">{hit.dealer.business_name}</div>
                  <div className="catalog-cta">Ver catálogo del local →</div>
                </div>
              </button>
              <a
                className="hit-phone hit-phone-bar"
                href={`tel:${hit.dealer.phone}`}
              >
                Llamar {hit.dealer.phone}
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
