import type { Dealer } from "./types";
import { getLastUpdatedAt } from "./marketplace";

export type DirectoryStat = {
  value: string;
  label: string;
};

function formatEs(n: number): string {
  return n.toLocaleString("es-VE");
}

/** Tiempo relativo estilo “1h 55min” / “ahora” / “3 días”. */
export function formatRelativeUpdate(fromMs: number, now = Date.now()): string {
  const diff = Math.max(0, now - fromMs);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours < 48) {
    return rem > 0 ? `${hours}h ${rem}min` : `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 día" : `${days} días`;
}

export function computeDirectoryStats(dealers: Dealer[]): DirectoryStat[] {
  const listingCount = dealers.reduce((n, d) => n + d.listings.length, 0);
  const codes = new Set(
    dealers.flatMap((d) => d.listings.map((l) => l.part_number.toUpperCase())),
  );
  const states = new Set(dealers.map((d) => d.state).filter(Boolean));
  const withListings = dealers.filter((d) => d.listings.length > 0).length;

  return [
    { value: formatEs(dealers.length), label: "Locales registrados" },
    { value: formatEs(listingCount), label: "Rodamientos listados" },
    { value: formatEs(codes.size), label: "Códigos distintos" },
    {
      value: formatRelativeUpdate(getLastUpdatedAt()),
      label: "Última actualización",
    },
    { value: formatEs(states.size), label: "Estados con cobertura" },
    { value: formatEs(withListings), label: "Locales con lista activa" },
  ];
}
