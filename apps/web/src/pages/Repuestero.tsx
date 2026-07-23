import { useRef, useState, type FormEvent } from "react";
import { CSV_TEMPLATE, parseCsv, STATES } from "@buscarepuesto/shared";
import { SetupBanner } from "../components/SetupBanner";
import { useAuth } from "../lib/AuthContext";

export function Repuestero() {
  const {
    configured,
    loading,
    sessionDealer,
    sessionListings,
    login,
    logout,
    register,
    updateProfile,
    mergeListings,
    clearListings,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [reg, setReg] = useState({
    email: "",
    password: "",
    business_name: "",
    phone: "",
    address: "",
    state: "Carabobo",
    city: "",
  });

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const e2 = await login(loginEmail.trim(), loginPass);
    setBusy(false);
    if (e2) setErr(e2);
  }

  async function onRegister(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const e2 = await register(reg);
    setBusy(false);
    if (e2) setErr(e2);
    else setMsg("Cuenta creada. Si pide confirmación de email, confírmala e inicia sesión.");
  }

  function onFile(file: File) {
    setErr("");
    setMsg("");
    const reader = new FileReader();
    reader.onload = () => {
      void (async () => {
        try {
          const incoming = parseCsv(String(reader.result ?? ""));
          if (incoming.length === 0) {
            setErr("El archivo no tiene filas válidas.");
            return;
          }
          setBusy(true);
          const e2 = await mergeListings(incoming);
          setBusy(false);
          if (e2) setErr(e2);
          else setMsg(`Cargados ${incoming.length} ítems en tu catálogo.`);
        } catch (e) {
          setBusy(false);
          setErr(e instanceof Error ? e.message : "Error al leer CSV.");
        }
      })();
    };
    reader.readAsText(file, "UTF-8");
  }

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla-catalogo.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!configured) {
    return (
      <section className="dealer-auth">
        <SetupBanner />
      </section>
    );
  }

  if (loading) {
    return (
      <section className="dealer-auth">
        <p className="muted">Cargando sesión…</p>
      </section>
    );
  }

  if (!sessionDealer) {
    return (
      <section className="dealer-auth">
        <header className="panel-head">
          <h2>Cargar catálogo automotriz</h2>
          <p>
            Regístrate gratis con email, sube tu CSV y cuando alguien busque un
            código, te aparece con teléfono y dirección.{" "}
            <strong>100% gratis · sin membresía</strong>.
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
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </label>
            <label className="field">
              <span>Contraseña</span>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>
            {err && <p className="bad">{err}</p>}
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? "…" : "Entrar"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={onRegister}>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={reg.email}
                onChange={(e) => setReg((r) => ({ ...r, email: e.target.value }))}
                placeholder="tu@email.com"
              />
            </label>
            <label className="field">
              <span>Contraseña (mín. 6)</span>
              <input
                type="password"
                value={reg.password}
                onChange={(e) =>
                  setReg((r) => ({ ...r, password: e.target.value }))
                }
                placeholder="••••••••"
              />
            </label>
            <label className="field">
              <span>Nombre del negocio</span>
              <input
                value={reg.business_name}
                onChange={(e) =>
                  setReg((r) => ({ ...r, business_name: e.target.value }))
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
            {err && <p className="bad">{err}</p>}
            {msg && <p className="ok">{msg}</p>}
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? "…" : "Crear cuenta gratis"}
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
          <h2>{sessionDealer.business_name}</h2>
          <p>
            {sessionDealer.state} · {sessionDealer.city} · {sessionDealer.phone}
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={() => void logout()}>
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
              value={sessionDealer.business_name}
              onChange={(e) =>
                void updateProfile({ business_name: e.target.value })
              }
            />
          </label>
          <label className="field">
            <span>Teléfono</span>
            <input
              value={sessionDealer.phone}
              onChange={(e) => void updateProfile({ phone: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Dirección</span>
            <input
              value={sessionDealer.address}
              onChange={(e) => void updateProfile({ address: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Ciudad</span>
            <input
              value={sessionDealer.city}
              onChange={(e) => void updateProfile({ city: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Estado</span>
            <select
              value={sessionDealer.state}
              onChange={(e) => void updateProfile({ state: e.target.value })}
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
        <h2>Mi catálogo de repuestos</h2>
        <p>
          Sube CSV: código, nombre, marca, modelo, observación. Queda en la base
          compartida en la nube.
        </p>
      </header>

      <div className="toolbar">
        <button
          type="button"
          className="btn-primary"
          disabled={busy}
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
          disabled={busy}
          onClick={() => {
            void (async () => {
              setBusy(true);
              const e2 = await clearListings();
              setBusy(false);
              if (e2) setErr(e2);
              else {
                setMsg("Catálogo vaciado.");
                setErr("");
              }
            })();
          }}
        >
          Vaciar catálogo
        </button>
        <span className="toolbar-meta">{sessionListings.length} ítems</span>
      </div>

      {msg && <p className="ok">{msg}</p>}
      {err && <p className="bad">{err}</p>}

      {sessionListings.length === 0 ? (
        <div className="empty">
          Aún no tienes repuestos en el catálogo. Sube el CSV o descarga la
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
              {sessionListings.map((item) => (
                <tr key={item.id}>
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
