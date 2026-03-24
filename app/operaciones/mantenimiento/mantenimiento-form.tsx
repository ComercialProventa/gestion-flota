"use client";

import { useState, useEffect } from "react";
import { registrarMantenimiento } from "./actions";

type Bus = {
  id: string;
  patente: string;
};

const PIEZAS_COMUNES = [
  "Pastillas de freno",
  "Discos de freno",
  "Aceite de motor",
  "Filtro de aceite",
  "Filtro de aire",
  "Filtro de combustible",
  "Batería",
  "Banda de motor",
  "Manguera de presión",
  "Amortiguador",
];

export default function MantenimientoForm({ buses }: { buses: Bus[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    setFecha(new Date().toLocaleDateString("en-CA")); // YYYY-MM-DD
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setExito(null);

    const result = await registrarMantenimiento(formData);
    
    if (result.error) setError(result.error);
    else {
      setExito(result.mensaje!);
      const f = document.getElementById("form-mant") as HTMLFormElement;
      f.reset();
      setFecha(new Date().toLocaleDateString("en-CA"));
    }
    
    setLoading(false);
  }

  const inputClasses = "w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-base text-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors";

  return (
    <form id="form-mant" action={handleSubmit} className="space-y-4">
      {exito && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3 text-sm font-medium text-emerald-400">
          ✅ {exito}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3 text-sm font-medium text-red-400">
          ❌ {error}
        </div>
      )}

      <div>
        <label htmlFor="bus_id" className="block text-sm font-medium text-slate-300 mb-1.5">Unidad</label>
        <select id="bus_id" name="bus_id" required className={inputClasses}>
          <option value="">Selecciona una unidad...</option>
          {buses.map(b => (
            <option key={b.id} value={b.id}>{b.patente}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="fecha" className="block text-sm font-medium text-slate-300 mb-1.5">Fecha</label>
        <input type="date" id="fecha" name="fecha" required value={fecha} onChange={e => setFecha(e.target.value)} className={inputClasses} />
      </div>

      <div>
        <label htmlFor="tipo_pieza" className="block text-sm font-medium text-slate-300 mb-1.5">Tipo de Pieza / Servicio</label>
        <input 
          type="text" 
          id="tipo_pieza" 
          name="tipo_pieza" 
          required 
          list="piezas-list"
          placeholder="Ej: Pastillas de freno" 
          className={inputClasses} 
        />
        <datalist id="piezas-list">
          {PIEZAS_COMUNES.map(p => <option key={p} value={p} />)}
        </datalist>
      </div>

      <div>
        <label htmlFor="costo" className="block text-sm font-medium text-slate-300 mb-1.5">Costo Unitario ($)</label>
        <input type="number" id="costo" name="costo" required min={0} placeholder="Ej: 45000" className={`${inputClasses} font-mono`} />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-slate-300 mb-1.5">Descripción (opcional)</label>
        <textarea id="descripcion" name="descripcion" rows={2} placeholder="N° Factura, motivo del cambio..." className={inputClasses} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-xl bg-sky-600 px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-500 disabled:opacity-50 transition-all cursor-pointer"
      >
        {loading ? "Registrando..." : "Registrar Mantenimiento"}
      </button>
    </form>
  );
}
