import { useEffect, useState } from "react";
import type { DealerProfile, ListingRow } from "@buscarepuesto/shared";
import { fetchDealer, fetchDealerListings } from "../lib/api";
import { BearingVisual } from "./BearingVisual";

type Props = {
  dealerId: string;
  highlightCode?: string;
  onBack: () => void;
};

export function DealerCatalog({ dealerId, highlightCode, onBack }: Props) {
  const [dealer, setDealer] = useState<DealerProfile | null>(null);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [err, setErr] = useState("");
  const highlight = highlightCode?.trim().toUpperCase() ?? "";

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchDealer(dealerId), fetchDealerListings(dealerId)])
      .then(([d, list]) => {
        if (cancelled) return;
        setDealer(d);
        setListings(list);
      })
      .catch((e) => {
        if (!cancelled)
          setErr(e instanceof Error ? e.message : "Error al cargar catálogo");
      });
    return () => {
      cancelled = true;
    };
  }, [dealerId]);

  if (err) {
    return (
      <section className="dealer-catalog">
        <button type="button" className="btn-ghost catalog-back" onClick={onBack}>
          ← Volver
        </button>
        <p className="bad">{err}</p>
      </section>
    );
  }

  if (!dealer) {
    return (
      <section className="dealer-catalog">
        <button type="button" className="btn-ghost catalog-back" onClick={onBack}>
          ← Volver
        </button>
        <p className="muted">Cargando catálogo…</p>
      </section>
    );
  }

  return (
    <section className="dealer-catalog">
      <button type="button" className="btn-ghost catalog-back" onClick={onBack}>
        ← Volver
      </button>

      <header className="catalog-hero">
        <h2>{dealer.business_name}</h2>
        <p className="catalog-place">
          <strong>{dealer.state}</strong> · {dealer.city}
        </p>
        <p className="catalog-address">{dealer.address}</p>
        <a className="hit-phone catalog-phone" href={`tel:${dealer.phone}`}>
          {dealer.phone}
        </a>
        <p className="muted">
          Catálogo de rodamientos · {listings.length} ítem
          {listings.length === 1 ? "" : "s"} · sin precios
        </p>
      </header>

      {listings.length === 0 ? (
        <div className="empty">Este local aún no cargó su catálogo.</div>
      ) : (
        <div className="latest-grid">
          {listings.map((item) => {
            const isHit =
              highlight &&
              item.part_number.toUpperCase().includes(highlight);
            return (
              <article
                className={`latest-card latest-card-static${isHit ? " catalog-hit" : ""}`}
                key={item.id}
              >
                <BearingVisual
                  partNumber={item.part_number}
                  brand={item.brand}
                />
                <div className="latest-body">
                  <div className="hit-code">{item.part_number}</div>
                  <div className="latest-name">{item.name}</div>
                  <div className="hit-meta">
                    <span>{item.brand}</span>
                    {item.model && <span>· {item.model}</span>}
                  </div>
                  <div className="hit-obs">{item.observation}</div>
                  {isHit && (
                    <div className="catalog-match">Coincide con tu búsqueda</div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
