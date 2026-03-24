"use client";

import { useState } from "react";
import { crearModelo } from "./actions";

// 1. Definimos nuestras listas de valores pre-escritos (sugerencias)
const MARCAS_SUGERIDAS = [
  "Michelin",
  "Bridgestone",
  "Goodyear",
  "Pirelli",
  "Firestone",
  "Continental",
  "Fate",
  "Triangle"
];

const MEDIDAS_SUGERIDAS = [
  "295/80R22.5",
  "275/80R22.5",
  "315/80R22.5",
  "12R22.5",
  "11R22.5"
];

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
      const form = document.getElementById("modelo-form") as HTMLFormElement;
      form?.reset();
      setTimeout(() => setExito(false), 3000);
    }

    setLoading(false);
  }

  const inputClasses =
    "w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 focus:outline-none transition-colors";

  const labelClasses = "block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide";

  return (
    <form id="modelo-form" action={handleSubmit} className="space-y-4">
      {exito && (
        <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-sm font-medium text-emerald-400">
          OK Modelo creado exitosamente
        </div>
      )}
      {error && (
        <div className="rounded border border-red-500/20 bg-red-500/10 p-2.5 text-sm font-medium text-red-400">
          ! {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

        {/* FABRICANTE CON DATALIST */}
        <div className="lg:col-span-1">
          <label htmlFor="marca" className={labelClasses}>Fabricante</label>
          {/* El atributo list="lista-marcas" conecta este input con el datalist de abajo */}
          <input
            id="marca"
            name="marca"
            type="text"
            list="lista-marcas"
            required
            placeholder="Ej: Michelin"
            className={inputClasses}
            autoComplete="off"
          />
          <datalist id="lista-marcas">
            {MARCAS_SUGERIDAS.map((marca) => (
              <option key={marca} value={marca} />
            ))}
          </datalist>
        </div>

        {/* MEDIDA CON DATALIST */}
        <div className="lg:col-span-1">
          <label htmlFor="medida" className={labelClasses}>Medida</label>
          <input
            id="medida"
            name="medida"
            type="text"
            list="lista-medidas"
            required
            placeholder="Ej: 295/80R22.5"
            className={inputClasses}
            autoComplete="off"
          />
          <datalist id="lista-medidas">
            {MEDIDAS_SUGERIDAS.map((medida) => (
              <option key={medida} value={medida} />
            ))}
          </datalist>
        </div>

        {/* La Aplicación sigue siendo un select estricto, porque los ejes de un camión/bus no cambian */}
        <div className="lg:col-span-1">
          <label htmlFor="aplicacion_eje" className={labelClasses}>Aplicación</label>
          <select id="aplicacion_eje" name="aplicacion_eje" required className={inputClasses}>
            <option value="" className="bg-slate-800">Seleccionar...</option>
            <option value="direccional" className="bg-slate-800">Direccional</option>
            <option value="traccion" className="bg-slate-800">Tracción</option>
            <option value="remolque" className="bg-slate-800">Remolque / Trailer</option>
            <option value="toda_posicion" className="bg-slate-800">Toda Posición</option>
          </select>
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="vida_util_km" className={labelClasses}>Vida Útil (KM)</label>
          <input id="vida_util_km" name="vida_util_km" type="number" required min={1000} step={1000} placeholder="Ej: 120000" className={`${inputClasses} font-mono`} />
        </div>

        <div className="lg:col-span-1 pt-2 lg:pt-0">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center rounded bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? "Guardando..." : "Registrar"}
          </button>
        </div>

      </div>
    </form>
  );
}