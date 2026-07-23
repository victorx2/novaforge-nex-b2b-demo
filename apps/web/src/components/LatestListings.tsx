import { useEffect, useState } from "react";
import type { SearchHit } from "@buscarepuesto/shared";
import { fetchLatestListings } from "../lib/api";
import { supabaseConfigured } from "../lib/supabase";
import { PartVisual } from "./PartVisual";

type Props = {
  onOpenDealer: (dealerId: string, code?: string) => void;
};

export function LatestListings({ onOpenDealer }: Props) {
  const [latest, setLatest] = useState<SearchHit[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    fetchLatestListings(12)
      .then((rows) => {
        if (!cancelled) setLatest(rows);
      })
      .catch((e) => {
        if (!cancelled)
          setErr(e instanceof Error ? e.message : "Error al cargar listados");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!supabaseConfigured) return null;
  if (err) return <p className="bad">{err}</p>;
  if (latest.length === 0) {
    return (
      <section className="latest-section">
        <header className="latest-head">
          <h2>Últimos listados</h2>
          <p>Aún no hay repuestos cargados en la base.</p>
        </header>
      </section>
    );
  }

  return (
    <section className="latest-section" aria-label="Últimos listados">
      <header className="latest-head">
        <h2>Últimos listados</h2>
        <p>
          Piezas automotrices recién cargadas. Toca una tarjeta para ver el{" "}
          <strong>catálogo completo</strong> de ese local.
        </p>
      </header>

      <div className="latest-grid">
        {latest.map((hit) => (
          <button
            type="button"
            className="latest-card"
            key={hit.listing.id}
            onClick={() =>
              onOpenDealer(hit.dealer.id, hit.listing.part_number)
            }
          >
            <PartVisual
              partNumber={hit.listing.part_number}
              brand={hit.listing.brand}
            />
            <div className="latest-body">
              <div className="hit-code">{hit.listing.part_number}</div>
              <div className="latest-name">{hit.listing.name}</div>
              <div className="hit-meta">
                <span>{hit.listing.brand}</span>
                {hit.listing.model && <span>· {hit.listing.model}</span>}
              </div>
              <div className="hit-obs">{hit.listing.observation}</div>
              <div className="hit-place">
                <strong>{hit.dealer.state}</strong> · {hit.dealer.city}
              </div>
              <div className="hit-biz">{hit.dealer.business_name}</div>
              <div className="catalog-cta">Ver catálogo del local →</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
