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

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pass === PASS) {
      setErr("");
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    } else {
      setErr("Contraseña incorrecta.");
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={onSubmit}>
        <h1>BuscaRepuesto</h1>
        <p>
          Busca el rodamiento por código. Te mostramos locales con teléfono y
          dirección. El precio lo cuadran ustedes.
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
      </form>
    </div>
  );
}
