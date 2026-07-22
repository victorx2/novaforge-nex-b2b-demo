import { BearingVisual } from "./BearingVisual";
import type { Dealer } from "../lib/types";

type Props = {
  dealer: Dealer;
  highlightCode?: string;
  onBack: () => void;
};

export function DealerCatalog({ dealer, highlightCode, onBack }: Props) {
  const highlight = highlightCode?.trim().toUpperCase() ?? "";

  return (
    <section className="dealer-catalog">
      <button type="button" className="btn-ghost catalog-back" onClick={onBack}>
        ← Volver
      </button>

      <header className="catalog-hero">
        <h2>{dealer.businessName}</h2>
        <p className="catalog-place">
          <strong>{dealer.state}</strong> · {dealer.city}
        </p>
        <p className="catalog-address">{dealer.address}</p>
        <a className="hit-phone catalog-phone" href={`tel:${dealer.phone}`}>
          {dealer.phone}
        </a>
        <p className="muted">
          Catálogo de rodamientos de este local · {dealer.listings.length}{" "}
          ítem{dealer.listings.length === 1 ? "" : "s"} · sin precios (llaman y
          cuadran)
        </p>
      </header>

      {dealer.listings.length === 0 ? (
        <div className="empty">Este local aún no cargó su catálogo.</div>
      ) : (
        <div className="latest-grid">
          {dealer.listings.map((item, i) => {
            const isHit =
              highlight &&
              item.part_number.toUpperCase().includes(highlight);
            return (
              <article
                className={`latest-card latest-card-static${isHit ? " catalog-hit" : ""}`}
                key={`${item.part_number}-${item.brand}-${item.observation}-${i}`}
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
