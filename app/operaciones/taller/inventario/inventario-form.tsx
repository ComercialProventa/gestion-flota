"use client";

import { useState, useEffect } from "react";
import { obtenerModelos, registrarNeumaticoInventario } from "./actions";

type Modelo = { id: string; marca: string; medida: string };

export default function InventarioForm() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null);

  useEffect(() => { obtenerModelos().then(setModelos); }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true); setError(null); setExito(null); setCodigoGenerado(null);
    const result = await registrarNeumaticoInventario(formData);
    if (result.error) { setError(result.error); }
    else {
      setExito(result.mensaje!);
      setCodigoGenerado(result.codigoGenerado!);
      const form = document.getElementById("inventario-form") as HTMLFormElement;
      form?.reset();
    }
    setLoading(false);
  }

  // ─── CLASES TÁCTICAS (COMPACTAS PERO LEGIBLES) ───
  // h-14 = 56px (perfecto para dedos sin comerse toda la pantalla)
  const inputUI = "w-full h-14 rounded-sm border-2 border-emerald-500/30 bg-black px-3 font-mono text-xl font-black text-white focus:border-emerald-500 focus:outline-none transition-colors uppercase placeholder:text-slate-700";
  const labelUI = "block text-[11px] font-black text-slate-400 mb-1 uppercase tracking-widest";

  return (
    <form id="inventario-form" action={handleSubmit} className="space-y-3 w-full">

      {/* ─── ÉXITO: COMPACTO ─── */}
      {exito && (
        <div className="rounded-sm border-2 border-emerald-500 bg-emerald-500/10 p-3 text-center animate-in fade-in">
          <p className="text-[12px] font-black text-emerald-400 uppercase tracking-widest mb-2">INGRESO OK</p>
          {codigoGenerado && (
            <div className="bg-black border-2 border-emerald-500/30 py-2 rounded-sm">
              <span className="font-mono text-4xl font-black text-white tracking-tighter leading-none">{codigoGenerado}</span>
            </div>
          )}
        </div>
      )}

      {/* ─── ERROR ─── */}
      {error && (
        <div className="rounded-sm border-2 border-red-500 bg-red-500/10 p-3 text-center animate-in fade-in">
          <p className="text-[12px] font-black text-red-500 uppercase tracking-widest">⚠ {error}</p>
        </div>
      )}

      {/* MODELO */}
      <div>
        <label htmlFor="modelo_id" className={labelUI}>MODELO / MEDIDA *</label>
        <select id="modelo_id" name="modelo_id" required className={inputUI}>
          <option value="">-- SELECCIONAR --</option>
          {modelos.map((m) => (
            <option key={m.id} value={m.id}>{m.marca} — {m.medida}</option>
          ))}
        </select>
      </div>

      {/* SERIE + DOT EN LA MISMA LÍNEA */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="numero_serie" className={labelUI}>N° SERIE *</label>
          <input id="numero_serie" name="numero_serie" type="text" required placeholder="GRABADO" className={inputUI} />
        </div>
        <div>
          <label htmlFor="codigo_dot" className={labelUI}>DOT *</label>
          <input
            id="codigo_dot"
            name="codigo_dot"
            type="tel"
            inputMode="numeric"
            required
            maxLength={4}
            placeholder="4223"
            className={inputUI}
            onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, ''); }}
          />
        </div>
      </div>

      {/* CONDICIÓN */}
      <div>
        <label htmlFor="ciclo_vida" className={labelUI}>CONDICIÓN *</label>
        <select id="ciclo_vida" name="ciclo_vida" className={inputUI}>
          <option value="nuevo">NUEVO</option>
          <option value="recapado_1">RECAPADO 1</option>
          <option value="recapado_2">RECAPADO 2</option>
          <option value="recapado_3">RECAPADO 3</option>
        </select>
      </div>

      {/* FACTURA Y PROVEEDOR (OPCIONALES) COMPACTADOS */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-white/10">
        <div>
          <label htmlFor="factura_numero" className={labelUI}>FACTURA</label>
          <input id="factura_numero" name="factura_numero" type="text" placeholder="OPCIONAL" className={inputUI} />
        </div>
        <div>
          <label htmlFor="proveedor" className={labelUI}>PROVEEDOR</label>
          <input id="proveedor" name="proveedor" type="text" placeholder="OPCIONAL" className={inputUI} />
        </div>
      </div>

      {/* ─── BOTÓN DE EJECUCIÓN (FIJO Y DIRECTO) ─── */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || modelos.length === 0}
          className="w-full h-16 rounded-sm bg-emerald-500 text-black text-[18px] font-black uppercase tracking-[0.2em] active:scale-[0.98] disabled:opacity-20 disabled:grayscale transition-all"
        >
          {loading ? "PROCESANDO..." : "INGRESAR A BODEGA"}
        </button>
      </div>
    </form>
  );
}