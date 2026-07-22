import { useMemo } from "react";
import { useMarketplace } from "../lib/MarketplaceContext";
import { computeDirectoryStats } from "../lib/stats";

export function DirectoryStats() {
  const { dealers } = useMarketplace();
  const stats = useMemo(() => computeDirectoryStats(dealers), [dealers]);

  return (
    <section className="stats-strip" aria-label="Resumen del directorio">
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-cell" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
