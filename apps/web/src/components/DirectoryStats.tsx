import { useEffect, useState } from "react";
import {
  formatEsNumber,
  formatRelativeUpdate,
} from "@buscarepuesto/shared";
import { fetchDirectoryStats } from "../lib/api";
import { supabaseConfigured } from "../lib/supabase";

type Stats = {
  dealers: number;
  listings: number;
  codes: number;
  states: number;
  withListings: number;
  lastUpdatedMs: number;
};

export function DirectoryStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    fetchDirectoryStats()
      .then((s) => {
        if (!cancelled) setStats(s);
      })
      .catch((e) => {
        if (!cancelled)
          setErr(e instanceof Error ? e.message : "Error al cargar stats");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!supabaseConfigured) return null;
  if (err) return <p className="bad">{err}</p>;
  if (!stats) {
    return (
      <section className="stats-strip">
        <p className="muted" style={{ textAlign: "center", margin: 0 }}>
          Cargando resumen…
        </p>
      </section>
    );
  }

  const cells = [
    { value: formatEsNumber(stats.dealers), label: "Locales registrados" },
    { value: formatEsNumber(stats.listings), label: "Rodamientos listados" },
    { value: formatEsNumber(stats.codes), label: "Códigos distintos" },
    {
      value: formatRelativeUpdate(stats.lastUpdatedMs),
      label: "Última actualización",
    },
    { value: formatEsNumber(stats.states), label: "Estados con cobertura" },
    {
      value: formatEsNumber(stats.withListings),
      label: "Locales con lista activa",
    },
  ];

  return (
    <section className="stats-strip" aria-label="Resumen del directorio">
      <div className="stats-grid">
        {cells.map((s) => (
          <div className="stat-cell" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
