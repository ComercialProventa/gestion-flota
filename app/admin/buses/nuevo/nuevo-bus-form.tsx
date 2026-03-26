"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ChasisPreview from "@/components/buses/chasis-preview";
import { registrarBus } from "../actions";

/**
 * Client Component — Formulario para registrar un nuevo bus.
 *
 * Layout de dos columnas en desktop:
 * - Izquierda: formulario con todos los campos
 * - Derecha: previsualización en tiempo real del chasis seleccionado
 *
 * El selector de chasis controla qué tipo de bus se dibuja en <ChasisPreview />.
 */
export default function NuevoBusForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [chasis, setChasis] = useState<"estandar_6" | "doble_piso_10">("estandar_6");
  const [error, setError] = useState<string | null>(null);

  // ─── Configuración de React Query ──────────────────────────────
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await registrarBus(formData);
    },
    onSuccess: (result) => {
      // Si la Server Action devuelve un error controlado (ej: patente duplicada)
      if (result?.error) {
        setError(result.error);
        return;
      }

      // Si todo sale bien:
      if (result?.success) {
        // 1. Invalidamos la caché de la lista de buses para que se refresque en segundo plano
        queryClient.invalidateQueries({ queryKey: ["buses"] });
        // 2. Redirigimos al administrador a la vista general sin recargar la página
        router.push("/admin/buses");
      }
    },
    onError: () => {
      // Error de red o caída del servidor
      setError("Ocurrió un error inesperado al conectar con el servidor.");
    }
  });

  // Reemplazamos tu async manual por la llamada a la mutación
  function handleSubmit(formData: FormData) {
    setError(null);
    mutation.mutate(formData);
  }

  const inputClasses =
    "w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* ═══ Columna izquierda: Formulario ═══ */}
      <div className="lg:col-span-3">
        <form action={handleSubmit} className="space-y-5">
          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          )}

          {/* Patente */}
          <div>
            <label htmlFor="patente" className={labelClasses}>Patente</label>
            <input
              id="patente"
              name="patente"
              type="text"
              required
              placeholder="Ej: ABCD-12"
              className={`${inputClasses} uppercase font-mono tracking-wider`}
            />
          </div>

          {/* Marca y Modelo (lado a lado) */}
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

          {/* Año y Asientos (lado a lado) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ano" className={labelClasses}>Año</label>
              <input id="ano" name="ano" type="number" required min={1990} max={new Date().getFullYear() + 1} placeholder="Ej: 2022" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="asientos" className={labelClasses}>Asientos</label>
              <input id="asientos" name="asientos" type="number" required min={1} max={100} placeholder="Ej: 44" className={inputClasses} />
            </div>
          </div>

          {/* Tipo de Chasis */}
          <div>
            <label className={labelClasses}>Configuración de Chasis</label>
            <input type="hidden" name="chasis" value={chasis} />
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setChasis("estandar_6")}
                className={`rounded-xl border p-3 text-center text-sm font-medium transition-all cursor-pointer ${chasis === "estandar_6"
                    ? "border-sky-500 bg-sky-500/15 text-sky-400 ring-2 ring-sky-500/20"
                    : "border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500"
                  }`}
              >
                <span className="block text-xs font-bold mb-0.5 uppercase tracking-wider">6R</span>
              </button>
              <button
                type="button"
                onClick={() => setChasis("doble_piso_10")}
                className={`rounded-xl border p-3 text-center text-sm font-medium transition-all cursor-pointer ${chasis === "doble_piso_10"
                    ? "border-sky-500 bg-sky-500/15 text-sky-400 ring-2 ring-sky-500/20"
                    : "border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500"
                  }`}
              >
                <span className="block text-xs font-bold mb-0.5 uppercase tracking-wider">10R</span>
              </button>
            </div>
          </div>

          {/* Fechas de vencimiento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="vencimiento_revision_tecnica" className={labelClasses}>Venc. Revisión Técnica</label>
              <input id="vencimiento_revision_tecnica" name="vencimiento_revision_tecnica" type="date" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="vencimiento_seguro" className={labelClasses}>Venc. Seguro</label>
              <input id="vencimiento_seguro" name="vencimiento_seguro" type="date" className={inputClasses} />
            </div>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-xl bg-sky-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {mutation.isPending ? (
              <span className="inline-flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Registrando...
              </span>
            ) : (
              "Registrar Bus"
            )}
          </button>
        </form>
      </div>

      {/* ═══ Columna derecha: Previsualización ═══ */}
      <div className="lg:col-span-2">
        <div className="sticky top-20 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Previsualización del Chasis
          </h3>
          <div className="flex items-center justify-center py-4 overflow-x-auto">
            <ChasisPreview tipo={chasis} />
          </div>
          <p className="text-center text-xs text-slate-500 mt-3">
            {chasis === "estandar_6"
              ? "1 eje delantero + 1 eje doble trasero = 6 ruedas"
              : "1 eje delantero + 2 ejes dobles traseros = 10 ruedas"}
          </p>
        </div>
      </div>
    </div>
  );
}