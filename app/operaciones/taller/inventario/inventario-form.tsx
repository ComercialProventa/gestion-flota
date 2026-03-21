"use client";

import { useState, useEffect } from "react";
import { obtenerModelos, registrarNeumaticoInventario } from "./actions";

type Modelo = { id: string; marca: string; medida: string };

/**
 * Client Component — Formulario mobile-first para registrar neumáticos
 * nuevos que llegan al taller.
 *
 * Campos:
 * - Modelo (select, obtenido de modelos_neumaticos)
 * - Serial/Código Proveedor (opcional)
 * - Número Factura (opcional)
 * - Proveedor (opcional)
 *
 * Al guardar, se genera un código único y el neumático queda en estado 'inventario'.
 */
export default function InventarioForm() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null);

  // Cargar modelos disponibles
  useEffect(() => {
    obtenerModelos().then(setModelos);
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setExito(null);
    setCodigoGenerado(null);

    const result = await registrarNeumaticoInventario(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setExito(result.mensaje!);
      setCodigoGenerado(result.codigoGenerado!);
      // Limpiar formulario
      const form = document.getElementById("inventario-form") as HTMLFormElement;
      form?.reset();
    }

    setLoading(false);
  }

  const inputClasses =
    "w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3.5 text-base text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors";

  return (
    <form id="inventario-form" action={handleSubmit} className="space-y-5">
      {/* Éxito con código generado */}
      {exito && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
          <p className="text-sm font-medium text-emerald-400">✅ {exito}</p>
          {codigoGenerado && (
            <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 px-3 py-2">
              <span className="text-xs text-slate-400">Código:</span>
              <span className="font-mono text-sm font-bold text-white">{codigoGenerado}</span>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400">
          ❌ {error}
        </div>
      )}

      {/* Modelo de Neumático */}
      <div>
        <label htmlFor="modelo_id" className="block text-sm font-medium text-slate-300 mb-1.5">
          Modelo de Neumático *
        </label>
        <select
          id="modelo_id"
          name="modelo_id"
          required
          className={inputClasses}
        >
          <option value="">Selecciona un modelo</option>
          {modelos.map((m) => (
            <option key={m.id} value={m.id}>
              {m.marca} — {m.medida}
            </option>
          ))}
        </select>
        {modelos.length === 0 && (
          <p className="mt-1 text-xs text-amber-400">
            No hay modelos. El administrador debe crearlos en /admin/neumaticos/modelos
          </p>
        )}
      </div>

      {/* Serial / Código Proveedor */}
      <div>
        <label htmlFor="serial" className="block text-sm font-medium text-slate-300 mb-1.5">
          Serial / Código Proveedor
          <span className="ml-1 text-xs text-slate-500">(opcional)</span>
        </label>
        <input
          id="serial"
          name="serial"
          type="text"
          placeholder="Ej: MIC12345"
          className={`${inputClasses} font-mono uppercase`}
        />
        <p className="mt-1 text-xs text-slate-500">
          Si no se ingresa, se genera un correlativo automático del día.
        </p>
      </div>

      {/* Factura y Proveedor (lado a lado) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="factura_numero" className="block text-sm font-medium text-slate-300 mb-1.5">
            N° Factura
            <span className="ml-1 text-xs text-slate-500">(opc.)</span>
          </label>
          <input
            id="factura_numero"
            name="factura_numero"
            type="text"
            placeholder="Ej: F-00123"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="proveedor" className="block text-sm font-medium text-slate-300 mb-1.5">
            Proveedor
            <span className="ml-1 text-xs text-slate-500">(opc.)</span>
          </label>
          <input
            id="proveedor"
            name="proveedor"
            type="text"
            placeholder="Ej: Michelin Chile"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-amber-600/25 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Registrando...
          </span>
        ) : (
          "Registrar Neumático"
        )}
      </button>
    </form>
  );
}
