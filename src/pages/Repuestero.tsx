import { useRef, useState, type FormEvent } from "react";
import { STATES } from "../data/states";
import { useMarketplace } from "../lib/MarketplaceContext";
import { CSV_TEMPLATE, parseCsv } from "../lib/parseCsv";

export function Repuestero() {
  const {
    sessionDealer,
    login,
    logout,
    register,
    updateSessionProfile,
    mergeSessionListings,
    setSessionListings,
    resetDemo,
  } = useMarketplace();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [loginPhone, setLoginPhone] = useState("");
  const [loginPin, setLoginPin] = useState("");

  const [reg, setReg] = useState({
    businessName: "",
    phone: "",
    address: "",
    state: "Carabobo",
    city: "",
    pin: "",
  });

  function onLogin(e: FormEvent) {
    e.preventDefault();
    setErr("");
    const e2 = login(loginPhone, loginPin);
    if (e2) setErr(e2);
  }

  function onRegister(e: FormEvent) {
    e.preventDefault();
    setErr("");
    const e2 = register(reg);
    if (e2) setErr(e2);
  }

  function onFile(file: File) {
    setErr("");
    setMsg("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = parseCsv(String(reader.result ?? ""));
        if (incoming.length === 0) {
          setErr("El archivo no tiene filas válidas.");
          return;
        }
        mergeSessionListings(incoming);
        setMsg(`Cargados ${incoming.length} ítems en tu lista.`);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Error al leer CSV.");
      }
    };
    reader.readAsText(file, "UTF-8");
  }

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla-lista.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!sessionDealer) {
    return (
      <section className="dealer-auth">
        <header className="panel-head">
          <h2>Cargar catálogo de rodamientos</h2>
          <p>
            Regístrate gratis, sube tu lista de rodamientos (CSV) y cuando
            alguien busque un código, te aparece con teléfono y dirección. Sin
            membresía.
          </p>
        </header>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "tab active" : "tab"}
            onClick={() => {
              setMode("login");
              setErr("");
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === "register" ? "tab active" : "tab"}
            onClick={() => {
              setMode("register");
              setErr("");
            }}
          >
            Registrarme
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={onLogin}>
            <p className="hint">
              Demo: usa un teléfono seed, p. ej.{" "}
              <strong>0412-5550101</strong> / PIN <strong>1234</strong>
            </p>
            <label className="field">
              <span>Teléfono</span>
              <input
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                placeholder="0412-5550101"
              />
            </label>
            <label className="field">
              <span>PIN</span>
              <input
                type="password"
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                placeholder="1234"
              />
            </label>
            {err && <p className="bad">{err}</p>}
            <button type="submit" className="btn-primary">
              Entrar
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={onRegister}>
            <label className="field">
              <span>Nombre del negocio</span>
              <input
                value={reg.businessName}
                onChange={(e) =>
                  setReg((r) => ({ ...r, businessName: e.target.value }))
                }
                placeholder="Repuestos El Centro"
              />
            </label>
            <label className="field">
              <span>Teléfono (público)</span>
              <input
                value={reg.phone}
                onChange={(e) =>
                  setReg((r) => ({ ...r, phone: e.target.value }))
                }
                placeholder="0412-0000000"
              />
            </label>
            <label className="field">
              <span>Dirección</span>
              <input
                value={reg.address}
                onChange={(e) =>
                  setReg((r) => ({ ...r, address: e.target.value }))
                }
                placeholder="Calle, local, ciudad"
              />
            </label>
            <div className="form-row">
              <label className="field">
                <span>Estado</span>
                <select
                  value={reg.state}
                  onChange={(e) =>
                    setReg((r) => ({ ...r, state: e.target.value }))
                  }
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Ciudad</span>
                <input
                  value={reg.city}
                  onChange={(e) =>
                    setReg((r) => ({ ...r, city: e.target.value }))
                  }
                  placeholder="Valencia"
                />
              </label>
            </div>
            <label className="field">
              <span>PIN (mín. 4)</span>
              <input
                type="password"
                value={reg.pin}
                onChange={(e) => setReg((r) => ({ ...r, pin: e.target.value }))}
                placeholder="••••"
              />
            </label>
            {err && <p className="bad">{err}</p>}
            <button type="submit" className="btn-primary">
              Crear cuenta gratis
            </button>
          </form>
        )}
      </section>
    );
  }

  return (
    <section className="dealer-panel">
      <header className="panel-head dealer-head">
        <div>
          <h2>{sessionDealer.businessName}</h2>
          <p>
            {sessionDealer.state} · {sessionDealer.city} · {sessionDealer.phone}
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={logout}>
          Salir
        </button>
      </header>

      <section className="company-card">
        <h3>Tu local (lo ve quien busca)</h3>
        <p className="muted">
          Solo dirección, teléfono y estado. Sin precios ni fachada en la
          búsqueda.
        </p>
        <div className="company-form">
          <label className="field">
            <span>Nombre</span>
            <input
              value={sessionDealer.businessName}
              onChange={(e) =>
                updateSessionProfile({ businessName: e.target.value })
              }
            />
          </label>
          <label className="field">
            <span>Teléfono</span>
            <input
              value={sessionDealer.phone}
              onChange={(e) => updateSessionProfile({ phone: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Dirección</span>
            <input
              value={sessionDealer.address}
              onChange={(e) =>
                updateSessionProfile({ address: e.target.value })
              }
            />
          </label>
          <label className="field">
            <span>Ciudad</span>
            <input
              value={sessionDealer.city}
              onChange={(e) => updateSessionProfile({ city: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Estado</span>
            <select
              value={sessionDealer.state}
              onChange={(e) => updateSessionProfile({ state: e.target.value })}
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <header className="panel-head">
        <h2>Mi catálogo de rodamientos</h2>
        <p>
          Sube CSV con 5 columnas: código, nombre, marca, modelo, observación
          (Nuevo / Usado…). Eso es lo que el cliente ve en tu catálogo público.
        </p>
      </header>

      <div className="toolbar">
        <button
          type="button"
          className="btn-primary"
          onClick={() => fileRef.current?.click()}
        >
          Subir catálogo CSV
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
        <button type="button" className="btn-ghost" onClick={downloadTemplate}>
          Descargar plantilla
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setSessionListings([]);
            setMsg("Lista vaciada.");
            setErr("");
          }}
        >
          Vaciar catálogo
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            resetDemo();
            setMsg("Demo restaurado (todos los locales seed).");
            setErr("");
          }}
        >
          Restaurar demo
        </button>
        <span className="toolbar-meta">
          {sessionDealer.listings.length} ítems
        </span>
      </div>

      {msg && <p className="ok">{msg}</p>}
      {err && <p className="bad">{err}</p>}

      {sessionDealer.listings.length === 0 ? (
        <div className="empty">
          Aún no tienes rodamientos en el catálogo. Sube el CSV o descarga la
          plantilla.
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {sessionDealer.listings.map((item, i) => (
                <tr
                  key={`${item.part_number}-${item.brand}-${item.observation}-${i}`}
                >
                  <td className="code">{item.part_number}</td>
                  <td>{item.name}</td>
                  <td>{item.brand}</td>
                  <td>{item.model}</td>
                  <td>{item.observation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
