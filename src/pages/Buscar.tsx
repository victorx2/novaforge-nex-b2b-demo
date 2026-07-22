import { useMemo, useState } from "react";
import { useInventory } from "../lib/InventoryContext";
import { searchInventory } from "../lib/inventory";

export function Buscar() {
  const { items } = useInventory();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const results = useMemo(
    () => (submitted ? searchInventory(items, submitted) : []),
    [items, submitted],
  );

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Buscar</h2>
        <p>Pon el código. Si está, te dice cuántos y dónde.</p>
      </header>

      <form
        className="search-row"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(query.trim());
        }}
      >
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej. 6205, 6205-2RS o 25x52x15"
          autoFocus
        />
        <button type="submit" className="btn-primary">
          Buscar
        </button>
      </form>

      {!submitted && (
        <p className="hint">Prueba: <button type="button" className="linkish" onClick={() => { setQuery("6205"); setSubmitted("6205"); }}>6205</button> o <button type="button" className="linkish" onClick={() => { setQuery("25x52x15"); setSubmitted("25x52x15"); }}>25x52x15</button></p>
      )}

      {submitted && results.length === 0 && (
        <div className="empty">
          No hay coincidencias para <strong>{submitted}</strong>.
        </div>
      )}

      {results.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Marca</th>
                <th>Cant.</th>
                <th>Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.part_number}>
                  <td className="code">{item.part_number}</td>
                  <td>{item.description}</td>
                  <td>{item.brand}</td>
                  <td className={item.qty <= 0 ? "qty-zero" : "qty"}>{item.qty}</td>
                  <td>{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
