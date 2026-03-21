"use client";

import { useState } from "react";
import ChasisPreview from "@/components/buses/chasis-preview";
import { registrarUnidad } from "../actions";

type EjesTipo = "2_ejes_6_ruedas" | "3_ejes_10_ruedas";

export default function NuevaUnidadForm() {
  const [chasis, setChasis] = useState<EjesTipo>("2_ejes_6_ruedas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoPreview(URL.createObjectURL(file));
    } else {
      setFotoPreview(null);
    }
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await registrarUnidad(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  const inputClasses = "w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <form action={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-400">
              ❌ {error}
            </div>
          )}

          <div>
            <label htmlFor="patente" className={labelClasses}>Patente</label>
            <input id="patente" name="patente" type="text" required placeholder="Ej: ABCD-12" className={`${inputClasses} uppercase font-mono tracking-wider`} />
          </div>

          <div>
            <label htmlFor="foto" className={labelClasses}>Fotografía del Vehículo</label>
            <div className="flex items-center gap-4">
              {fotoPreview && (
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-slate-600 shrink-0 relative flex items-center justify-center bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fotoPreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <input 
                id="foto" 
                name="foto" 
                type="file" 
                accept="image/*" 
                onChange={handleFotoChange}
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-sky-600/20 file:text-sky-400 hover:file:bg-sky-600/30 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="marca" className={labelClasses}>Marca</label>
              <input id="marca" name="marca" type="text" required placeholder="Ej: Mercedes-Benz" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="modelo" className={labelClasses}>Modelo</label>
              <input id="modelo" name="modelo" type="text" required placeholder="Ej: O-500" className={inputClasses} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ano" className={labelClasses}>Año</label>
              <input id="ano" name="ano" type="number" required min={1990} max={new Date().getFullYear() + 1} placeholder="Ej: 2022" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="asientos" className={labelClasses}>Asientos / Capacidad</label>
              <input id="asientos" name="asientos" type="number" required min={1} max={100} placeholder="Ej: 44" className={inputClasses} />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Configuración de Ejes</label>
            <input type="hidden" name="chasis" value={chasis} />
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setChasis("2_ejes_6_ruedas")}
                className={`rounded-xl border p-3 text-center text-sm font-medium transition-all cursor-pointer ${
                  chasis === "2_ejes_6_ruedas"
                    ? "border-sky-500 bg-sky-500/15 text-sky-400 ring-2 ring-sky-500/20"
                    : "border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500"
                }`}
              >
                <span className="block text-base mb-0.5">🚛</span>
                2 Ejes · 6 Ruedas
              </button>
              <button
                type="button"
                onClick={() => setChasis("3_ejes_10_ruedas")}
                className={`rounded-xl border p-3 text-center text-sm font-medium transition-all cursor-pointer ${
                  chasis === "3_ejes_10_ruedas"
                    ? "border-sky-500 bg-sky-500/15 text-sky-400 ring-2 ring-sky-500/20"
                    : "border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500"
                }`}
              >
                <span className="block text-base mb-0.5">🚍</span>
                3 Ejes · 10 Ruedas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="vencimiento_revision_tecnica" className={labelClasses}>Venc. Rev. Técnica</label>
              <input id="vencimiento_revision_tecnica" name="vencimiento_revision_tecnica" type="date" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="vencimiento_seguro" className={labelClasses}>Venc. Seguro</label>
              <input id="vencimiento_seguro" name="vencimiento_seguro" type="date" className={inputClasses} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? "Registrando..." : "Registrar Unidad"}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-20 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Previsualización de Ejes</h3>
          <div className="flex items-center justify-center py-4 overflow-x-auto">
            <ChasisPreview tipo={chasis} />
          </div>
          <p className="text-center text-xs text-slate-500 mt-3">
            {chasis === "2_ejes_6_ruedas"
              ? "1 eje direccional + 1 eje motriz doble = 6 ruedas"
              : "1 eje direccional + 2 ejes motrices dobles = 10 ruedas"}
          </p>
        </div>
      </div>
    </div>
  );
}
