/** Ilustración genérica de rodamiento (SVG propio, no logos oficiales). */
export function BearingVisual({
  partNumber,
  brand,
}: {
  partNumber: string;
  brand: string;
}) {
  const tone = toneFrom(partNumber + brand);
  const sealed = /2rs|rsr|rsh/i.test(partNumber);
  const shielded = /zz|2z|z$/i.test(partNumber);
  const taper = /^3\d{3}|uc/i.test(partNumber);

  return (
    <div className={`bearing-visual tone-${tone}`} aria-hidden>
      <svg viewBox="0 0 120 120" className="bearing-svg">
        <circle cx="60" cy="60" r="52" className="bv-outer" />
        <circle cx="60" cy="60" r="38" className="bv-mid" />
        <circle cx="60" cy="60" r="18" className="bv-inner" />
        {taper ? (
          <>
            <ellipse cx="60" cy="42" rx="10" ry="7" className="bv-ball" />
            <ellipse cx="78" cy="52" rx="10" ry="7" className="bv-ball" />
            <ellipse cx="78" cy="72" rx="10" ry="7" className="bv-ball" />
            <ellipse cx="60" cy="82" rx="10" ry="7" className="bv-ball" />
            <ellipse cx="42" cy="72" rx="10" ry="7" className="bv-ball" />
            <ellipse cx="42" cy="52" rx="10" ry="7" className="bv-ball" />
          </>
        ) : (
          <>
            <circle cx="60" cy="32" r="7" className="bv-ball" />
            <circle cx="88" cy="60" r="7" className="bv-ball" />
            <circle cx="60" cy="88" r="7" className="bv-ball" />
            <circle cx="32" cy="60" r="7" className="bv-ball" />
            <circle cx="80" cy="36" r="6.5" className="bv-ball" />
            <circle cx="80" cy="84" r="6.5" className="bv-ball" />
            <circle cx="40" cy="84" r="6.5" className="bv-ball" />
            <circle cx="40" cy="36" r="6.5" className="bv-ball" />
          </>
        )}
        {(sealed || shielded) && (
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            strokeWidth="3"
            className={sealed ? "bv-seal" : "bv-shield"}
          />
        )}
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
