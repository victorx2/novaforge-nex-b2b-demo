/** Ilustración genérica de pieza automotriz (SVG propio). */
export function PartVisual({
  partNumber,
  brand,
}: {
  partNumber: string;
  brand: string;
}) {
  const tone = toneFrom(partNumber + brand);

  return (
    <div className={`part-visual tone-${tone}`} aria-hidden>
      <svg viewBox="0 0 120 120" className="part-svg">
        <rect
          x="28"
          y="38"
          width="64"
          height="44"
          rx="6"
          className="pv-body"
        />
        <rect x="36" y="48" width="48" height="8" rx="2" className="pv-slot" />
        <rect x="36" y="64" width="32" height="8" rx="2" className="pv-slot" />
        <circle cx="84" cy="68" r="6" className="pv-bolt" />
        <path
          d="M40 28h40l8 10H32l8-10z"
          className="pv-top"
        />
      </svg>
      <span className="brand-badge">{shortBrand(brand)}</span>
    </div>
  );
}

function shortBrand(brand: string): string {
  const b = brand.trim();
  if (!b || b === "—") return "GEN";
  return b.length > 8 ? b.slice(0, 7) : b;
}

function toneFrom(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * (i + 1)) % 5;
  return h;
}
