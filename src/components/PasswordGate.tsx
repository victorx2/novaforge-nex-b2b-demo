import { useState, type FormEvent, type ReactNode } from "react";

const KEY = "nex-portfolio-unlock";
const PASS = "portfolio-demo";

export function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  });
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  function unlock() {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setUnlocked(true);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pass === PASS) {
      setErr("");
      unlock();
    } else {
      setErr("Contraseña incorrecta.");
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={onSubmit}>
        <h1>NEX Fase A — Buscar + Stock</h1>
        <p>
          Menú solo: Buscar y Mi stock. Pon el código; si está, te dice cuántos y
          dónde. (La maqueta completa está en /portfolio/)
        </p>
        <div className="gate-err">{err}</div>
        <input
          type="password"
          placeholder="Contraseña de acceso"
          autoComplete="current-password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button type="submit">Entrar</button>
        <p className="gate-note">Datos demo · noindex</p>
      </form>
    </div>
  );
}
