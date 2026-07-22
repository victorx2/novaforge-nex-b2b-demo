import { useMemo } from "react";
import { useMarketplace } from "../lib/MarketplaceContext";
import { getLatestListings } from "../lib/latest";
import { BearingVisual } from "./BearingVisual";

type Props = {
  onOpenDealer: (dealerId: string, code?: string) => void;
};

export function LatestListings({ onOpenDealer }: Props) {
  const { dealers } = useMarketplace();
  const latest = useMemo(() => getLatestListings(dealers, 12), [dealers]);

  if (latest.length === 0) return null;

  return (
    <section className="latest-section" aria-label="Últimos listados">
      <header className="latest-head">
        <h2>Últimos listados</h2>
        <p>
          Rodamientos recién cargados. Toca una tarjeta para ver el{" "}
          <strong>catálogo completo</strong> de ese local.
        </p>
      </header>

      <div className="latest-grid">
        {latest.map((hit, i) => (
          <button
            type="button"
            className="latest-card"
            key={`${hit.dealer.id}-${hit.listing.part_number}-${hit.listing.brand}-${i}`}
            onClick={() =>
              onOpenDealer(hit.dealer.id, hit.listing.part_number)
            }
          >
            <BearingVisual
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
              <div className="hit-biz">{hit.dealer.businessName}</div>
              <div className="catalog-cta">Ver catálogo del local →</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
