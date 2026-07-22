import { useMemo, useState } from "react";
import { BearingVisual } from "../components/BearingVisual";
import { DirectoryStats } from "../components/DirectoryStats";
import { LatestListings } from "../components/LatestListings";
import { STATES } from "../data/states";
import { useMarketplace } from "../lib/MarketplaceContext";
import { searchMarketplace } from "../lib/marketplace";

export function Buscar() {
  const { dealers } = useMarketplace();
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [submittedState, setSubmittedState] = useState("");

  const results = useMemo(
    () =>
      submitted
        ? searchMarketplace(dealers, submitted, submittedState)
        : [],
    [dealers, submitted, submittedState],
  );

  function runSearch(q: string, state: string) {
    setQuery(q);
    setStateFilter(state);
    setSubmitted(q.trim());
    setSubmittedState(state);
  }

  return (
    <section className="search-page">
      <div className="search-hero">
        <h1>¿Qué rodamiento buscas?</h1>
        <p>
          Escribe el código (ej. 6205-2RS). Te mostramos en qué locales lo tienen
          — con teléfono y dirección. El precio lo cuadran ustedes.
        </p>

        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(query, stateFilter);
          }}
        >
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej. 6205-2RS o 25x52x15"
            autoFocus
          />
          <select
            className="state-select"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="">Todo el país</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>

        {!submitted && (
          <p className="hint">
            Prueba:{" "}
            <button
              type="button"
              className="linkish"
              onClick={() => runSearch("6205", "")}
            >
              6205
            </button>{" "}
            en todo el país, o{" "}
            <button
              type="button"
              className="linkish"
              onClick={() => runSearch("6205", "Carabobo")}
            >
              6205 en Carabobo
            </button>
          </p>
        )}
      </div>

      <DirectoryStats />

      {!submitted && (
        <LatestListings
          onPickCode={(code, state) => runSearch(code, state ?? "")}
        />
      )}

      {submitted && (
        <p className="results-meta">
          {results.length} resultado{results.length === 1 ? "" : "s"} para{" "}
          <strong>{submitted}</strong>
          {submittedState ? ` · ${submittedState}` : " · nacional"}
          {" · "}
          <button
            type="button"
            className="linkish"
            onClick={() => {
              setSubmitted("");
              setSubmittedState("");
              setQuery("");
            }}
          >
            Ver últimos listados
          </button>
        </p>
      )}

      {submitted && results.length === 0 && (
        <div className="empty">
          Nadie tiene listado <strong>{submitted}</strong>
          {submittedState ? ` en ${submittedState}` : ""}. Prueba otro estado o
          código.
        </div>
      )}

      {results.length > 0 && (
        <div className="hits-grid">
          {results.map((hit, i) => (
            <article
              className="hit-card hit-card-media"
              key={`${hit.dealer.id}-${hit.listing.part_number}-${hit.listing.brand}-${hit.listing.observation}-${i}`}
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
                <a className="hit-phone" href={`tel:${hit.dealer.phone}`}>
                  {hit.dealer.phone}
                </a>
                <div className="hit-biz">{hit.dealer.businessName}</div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
