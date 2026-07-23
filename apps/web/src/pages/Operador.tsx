import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CATALOG_BY_DEALER_CSV_TEMPLATE,
  DEALERS_CSV_TEMPLATE,
  formatEsNumber,
  parseCatalogByDealerCsv,
  parseDealersCsv,
  type DealerProfile,
} from "@buscarepuesto/shared";
import {
  adminClearDealerListings,
  adminMergeListingsByDealer,
  adminUpsertDealers,
  fetchAllDealers,
  fetchDirectoryStats,
  fetchDealerListings,
} from "../lib/api";
import { useAuth } from "../lib/AuthContext";

function downloadBlob(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function Operador() {
  const { isAdmin, user, login, logout, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [dealers, setDealers] = useState<DealerProfile[]>([]);
  const [stats, setStats] = useState<{
    dealers: number;
    listings: number;
    codes: number;
    states: number;
  } | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const dealersFileRef = useRef<HTMLInputElement>(null);
  const catalogFileRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    const [d, s] = await Promise.all([
      fetchAllDealers(),
      fetchDirectoryStats(),
    ]);
    setDealers(d);
    setStats({
      dealers: s.dealers,
      listings: s.listings,
      codes: s.codes,
      states: s.states,
    });
    const next: Record<string, number> = {};
    await Promise.all(
      d.map(async (dealer) => {
        const list = await fetchDealerListings(dealer.id);
        next[dealer.id] = list.length;
      }),
    );
    setCounts(next);
  }

  useEffect(() => {
    if (!isAdmin) return;
    void refresh().catch((e) =>
      setErr(e instanceof Error ? e.message : "Error al cargar"),
    );
  }, [isAdmin]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const e2 = await login(email.trim(), password);
    setBusy(false);
    if (e2) setErr(e2);
  }

  function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
      reader.readAsText(file, "UTF-8");
    });
  }

  async function onDealersFile(file: File) {
    setErr("");
    setMsg("");
    try {
      const text = await readFile(file);
      const rows = parseDealersCsv(text);
      if (rows.length === 0) {
        setErr("El CSV de locales no tiene filas válidas.");
        return;
      }
      setBusy(true);
      const r = await adminUpsertDealers(rows);
      await refresh();
      setBusy(false);
      setMsg(
        `Locales: ${r.created} nuevos, ${r.updated} actualizados (${rows.length} filas).`,
      );
    } catch (e) {
      setBusy(false);
      setErr(e instanceof Error ? e.message : "Error al importar locales");
    }
  }

  async function onCatalogFile(file: File) {
    setErr("");
    setMsg("");
    try {
      const text = await readFile(file);
      const rows = parseCatalogByDealerCsv(text);
      if (rows.length === 0) {
        setErr("El CSV de catálogo no tiene filas válidas.");
        return;
      }
      setBusy(true);
      const r = await adminMergeListingsByDealer(rows);
      await refresh();
      setBusy(false);
      setMsg(
        `Catálogo: ${r.itemsMerged} ítems en ${r.dealersTouched} locales` +
          (r.skipped ? ` · ${r.skipped} sin local (teléfono/nombre)` : ""),
      );
    } catch (e) {
      setBusy(false);
      setErr(e instanceof Error ? e.message : "Error al importar catálogo");
    }
  }

  if (loading) {
    return (
      <section className="dealer-auth">
        <p className="muted">Cargando…</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="dealer-auth">
        <header className="panel-head">
          <h2>Operador</h2>
          <p>
            Entra con tu cuenta admin para cargar locales y catálogos a granel.
            La base de datos es el activo.
          </p>
        </header>
        <form className="auth-form" onSubmit={onLogin}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {err && <p className="bad">{err}</p>}
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? "…" : "Entrar"}
          </button>
        </form>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="dealer-auth">
        <header className="panel-head">
          <h2>Sin acceso de operador</h2>
          <p>
            Tu usuario no tiene <code>app_metadata.role = admin</code>. En
            Supabase → Authentication → Users → tu usuario → Raw App Meta Data:
            {" "}
            <code>{`{"role":"admin"}`}</code>
          </p>
        </header>
        <button type="button" className="btn-ghost" onClick={() => void logout()}>
          Salir
        </button>
        {err && <p className="bad">{err}</p>}
      </section>
    );
  }

  return (
    <section className="operador-page">
      <header className="panel-head dealer-head">
        <div>
          <h2>Operador · base de datos</h2>
          <p>
            Importa CSV (Excel → Guardar como CSV). Gratis para el mercado; tú
            llenas el activo.
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={() => void logout()}>
          Salir
        </button>
      </header>

      {stats && (
        <div className="ops-stats">
          <div>
            <strong>{formatEsNumber(stats.dealers)}</strong>
            <span>locales</span>
          </div>
          <div>
            <strong>{formatEsNumber(stats.listings)}</strong>
            <span>ítems</span>
          </div>
          <div>
            <strong>{formatEsNumber(stats.codes)}</strong>
            <span>códigos</span>
          </div>
          <div>
            <strong>{formatEsNumber(stats.states)}</strong>
            <span>estados</span>
          </div>
        </div>
      )}

      <div className="ops-import-grid">
        <section className="ops-card">
          <h3>1. Locales</h3>
          <p className="muted">
            Columnas: negocio, telefono, direccion, estado, ciudad
          </p>
          <div className="toolbar">
            <button
              type="button"
              className="btn-primary"
              disabled={busy}
              onClick={() => dealersFileRef.current?.click()}
            >
              Importar locales CSV
            </button>
            <input
              ref={dealersFileRef}
              type="file"
              accept=".csv,text/csv"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onDealersFile(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={() =>
                downloadBlob("plantilla-locales.csv", DEALERS_CSV_TEMPLATE)
              }
            >
              Plantilla
            </button>
          </div>
        </section>

        <section className="ops-card">
          <h3>2. Catálogo</h3>
          <p className="muted">
            Columnas: telefono (o negocio), codigo, nombre, marca, modelo,
            observacion
          </p>
          <div className="toolbar">
            <button
              type="button"
              className="btn-primary"
              disabled={busy}
              onClick={() => catalogFileRef.current?.click()}
            >
              Importar catálogo CSV
            </button>
            <input
              ref={catalogFileRef}
              type="file"
              accept=".csv,text/csv"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onCatalogFile(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={() =>
                downloadBlob(
                  "plantilla-catalogo-por-local.csv",
                  CATALOG_BY_DEALER_CSV_TEMPLATE,
                )
              }
            >
              Plantilla
            </button>
          </div>
        </section>
      </div>

      {msg && <p className="ok">{msg}</p>}
      {err && <p className="bad">{err}</p>}

      <h3 className="ops-list-title">Locales en la base</h3>
      {dealers.length === 0 ? (
        <div className="empty">Aún no hay locales. Importa el CSV.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Negocio</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Ciudad</th>
                <th>Ítems</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {dealers.map((d) => (
                <tr key={d.id}>
                  <td>{d.business_name}</td>
                  <td className="code">{d.phone}</td>
                  <td>{d.state}</td>
                  <td>{d.city}</td>
                  <td>{counts[d.id] ?? "—"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-ghost"
                      disabled={busy || !(counts[d.id] > 0)}
                      onClick={() => {
                        void (async () => {
                          if (
                            !confirm(
                              `¿Vaciar catálogo de ${d.business_name}?`,
                            )
                          )
                            return;
                          setBusy(true);
                          setErr("");
                          try {
                            await adminClearDealerListings(d.id);
                            await refresh();
                            setMsg(`Catálogo vaciado: ${d.business_name}`);
                          } catch (e) {
                            setErr(
                              e instanceof Error ? e.message : "Error al vaciar",
                            );
                          } finally {
                            setBusy(false);
                          }
                        })();
                      }}
                    >
                      Vaciar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
