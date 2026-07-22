import { useRef, useState } from "react";
import { useInventory } from "../lib/InventoryContext";
import { mergeInventory, resetInventory } from "../lib/inventory";
import { CSV_TEMPLATE, parseCsv } from "../lib/parseCsv";

export function MiStock() {
  const { items, setItems } = useInventory();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function onFile(file: File) {
    setErr("");
    setMsg("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const incoming = parseCsv(text);
        if (incoming.length === 0) {
          setErr("El archivo no tiene filas válidas.");
          return;
        }
        setItems((prev) => mergeInventory(prev, incoming));
        setMsg(`Importados ${incoming.length} ítems (merge por código).`);
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
    a.download = "plantilla-stock-nex.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function updateQty(part_number: string, qty: number) {
    setItems((prev) =>
      prev.map((it) =>
        it.part_number === part_number ? { ...it, qty: Math.max(0, qty) } : it,
      ),
    );
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Mi stock</h2>
        <p>Lista del inventario. Sube un CSV para actualizar cantidades y ubicaciones.</p>
      </header>

      <div className="toolbar">
        <button type="button" className="btn-primary" onClick={() => fileRef.current?.click()}>
          Subir CSV
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
            setItems(resetInventory());
            setMsg("Inventario restaurado al seed demo.");
            setErr("");
          }}
        >
          Restaurar demo
        </button>
        <span className="toolbar-meta">{items.length} ítems</span>
      </div>

      {msg && <p className="ok">{msg}</p>}
      {err && <p className="bad">{err}</p>}

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
            {items.map((item) => (
              <tr key={item.part_number}>
                <td className="code">{item.part_number}</td>
                <td>{item.description}</td>
                <td>{item.brand}</td>
                <td>
                  <input
                    className="qty-input"
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) => updateQty(item.part_number, Number(e.target.value))}
                  />
                </td>
                <td>{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
