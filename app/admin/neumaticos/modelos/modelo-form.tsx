"use client";

import { useState } from "react";
import { crearModelo } from "./actions";

/**
 * Client Component — Formulario inline para agregar un nuevo modelo de neumático.
 *
 * Campos: Marca, Medida, Vida Útil Km.
 * Al enviar correctamente, limpia el formulario y la página se revalida
 * gracias al revalidatePath del server action.
 */
export default function ModeloForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setExito(false);

    const result = await crearModelo(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setExito(true);
      // Limpiar formulario reseteando el form element
      const form = document.getElementById("modelo-form") as HTMLFormElement;
      form?.reset();
      setTimeout(() => setExito(false), 3000);
    }

    setLoading(false);
  }

  const inputClasses =
    "w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors";

  return (
    <form id="modelo-form" action={handleSubmit} className="space-y-4">
      {exito && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-400">
          ✅ Modelo creado exitosamente
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-400">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label htmlFor="marca" className="block text-xs font-medium text-slate-400 mb-1">Marca</label>
          <input id="marca" name="marca" type="text" required placeholder="Ej: Michelin" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="medida" className="block text-xs font-medium text-slate-400 mb-1">Medida</label>
          <input id="medida" name="medida" type="text" required list="medidas-comunes" placeholder="Ej: 295/80 R22.5" className={inputClasses} />
          <datalist id="medidas-comunes">
            <option value="295/80 R22.5" />
            <option value="315/80 R22.5" />
            <option value="275/70 R22.5" />
            <option value="11 R22.5" />
            <option value="12 R22.5" />
            <option value="385/65 R22.5" />
          </datalist>
        </div>
        <div>
          <label htmlFor="aplicacion_eje" className="block text-xs font-medium text-slate-400 mb-1">Aplicación (Diseño)</label>
          <select id="aplicacion_eje" name="aplicacion_eje" required className={inputClasses}>
            <option value="direccional">Direccional (Eje Delantero)</option>
            <option value="traccion">Tracción (Eje Motriz)</option>
            <option value="arrastre">Arrastre (Eje Libre/Remolque)</option>
            <option value="mixto">Mixto (Cualquier Eje)</option>
          </select>
        </div>
        <div>
          <label htmlFor="profundidad_estria_nueva_mm" className="block text-xs font-medium text-slate-400 mb-1">Estría Nueva (mm)</label>
          <input id="profundidad_estria_nueva_mm" name="profundidad_estria_nueva_mm" type="number" required min={5} max={30} step={1} placeholder="Ej: 20" defaultValue={20} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="vida_util_km" className="block text-xs font-medium text-slate-400 mb-1">Vida Útil (km)</label>
          <input id="vida_util_km" name="vida_util_km" type="number" required min={1000} step={1000} placeholder="Ej: 120000" className={inputClasses} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        {loading ? "Guardando..." : "Agregar Modelo"}
      </button>
    </form>
  );
}
