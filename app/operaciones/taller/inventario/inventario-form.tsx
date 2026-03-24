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

  const inputCls = "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-[14px] text-white placeholder-white/20 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition-colors";

  return (
    <form id="inventario-form" action={handleSubmit} className="space-y-3.5">
      {exito && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] p-3 space-y-1.5">
          <p className="text-[13px] font-medium text-emerald-400">✓ {exito}</p>
          {codigoGenerado && (
            <div className="flex items-center gap-2 rounded-md bg-black/30 px-2.5 py-1.5">
              <span className="text-[11px] text-white/30">Código:</span>
              <span className="font-mono text-[13px] font-bold text-white">{codigoGenerado}</span>
            </div>
          )}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/[0.06] p-3 text-[13px] font-medium text-red-400">
          ✕ {error}
        </div>
      )}

      <div>
        <label htmlFor="modelo_id" className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Modelo *</label>
        <select id="modelo_id" name="modelo_id" required className={inputCls}>
          <option value="" className="bg-slate-900 text-white">Selecciona un modelo</option>
          {modelos.map((m) => (<option key={m.id} value={m.id} className="bg-slate-900 text-white">{m.marca} — {m.medida}</option>))}
        </select>
        {modelos.length === 0 && (
          <p className="mt-1 text-[11px] text-amber-400/70">No hay modelos. El administrador debe crearlos primero.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label htmlFor="numero_serie" className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">N° Serie *</label>
          <input id="numero_serie" name="numero_serie" type="text" required placeholder="Grabado en goma" className={`${inputCls} font-mono uppercase`} />
        </div>
        <div>
          <label htmlFor="codigo_dot" className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">DOT *</label>
          <input id="codigo_dot" name="codigo_dot" type="text" required maxLength={4} placeholder="4223" className={inputCls} onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, ''); }} />
        </div>
      </div>

      <div>
        <label htmlFor="ciclo_vida" className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Condición</label>
        <select id="ciclo_vida" name="ciclo_vida" className={inputCls}>
          <option value="nuevo" className="bg-slate-900 text-white">Nuevo</option>
          <option value="recapado_1" className="bg-slate-900 text-white">Recapado 1</option>
          <option value="recapado_2" className="bg-slate-900 text-white">Recapado 2</option>
          <option value="recapado_3" className="bg-slate-900 text-white">Recapado 3</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label htmlFor="factura_numero" className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
            Factura <span className="text-white/20">(opc)</span>
          </label>
          <input id="factura_numero" name="factura_numero" type="text" placeholder="F-00123" className={inputCls} />
        </div>
        <div>
          <label htmlFor="proveedor" className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
            Proveedor <span className="text-white/20">(opc)</span>
          </label>
          <input id="proveedor" name="proveedor" type="text" placeholder="Michelin" className={inputCls} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-[14px] font-semibold text-black hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer"
      >
        {loading ? "Registrando..." : "Registrar Neumático"}
      </button>
    </form>
  );
}
