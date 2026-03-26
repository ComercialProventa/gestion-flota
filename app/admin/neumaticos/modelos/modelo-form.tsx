"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Importamos hooks de Query
import { crearModelo } from "./actions";

// Listas de sugerencias (se mantienen igual)
const MARCAS_SUGERIDAS = ["Michelin", "Bridgestone", "Goodyear", "Pirelli", "Firestone", "Continental", "Fate", "Triangle"];
const MEDIDAS_SUGERIDAS = ["295/80R22.5", "275/80R22.5", "315/80R22.5", "12R22.5", "11R22.5"];

export default function ModeloForm() {
  const queryClient = useQueryClient(); // Instanciamos el cliente
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  // 1. Definimos la mutación
  const mutation = useMutation({
    mutationFn: (formData: FormData) => crearModelo(formData),
    onSuccess: (result) => {
      if (result.error) {
        setErrorLocal(result.error);
        return;
      }

      // ¡ÉXITO!
      setExito(true);
      setErrorLocal(null);

      // Limpiamos el formulario nativamente
      const form = document.getElementById("modelo-form") as HTMLFormElement;
      form?.reset();

      // Refrescamos la lista de modelos instantáneamente
      queryClient.invalidateQueries({ queryKey: ["modelos_neumaticos"] });

      // Ocultamos el mensaje de éxito después de 3 segundos
      setTimeout(() => setExito(false), 3000);
    },
    onError: () => {
      setErrorLocal("Ocurrió un fallo de conexión con el servidor.");
    }
  });

  // 2. Simplificamos el handleSubmit
  async function handleSubmit(formData: FormData) {
    setExito(false);
    setErrorLocal(null);
    mutation.mutate(formData);
  }

  const inputClasses =
    "w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 focus:outline-none transition-colors";

  const labelClasses = "block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide";

  return (
    <form id="modelo-form" action={handleSubmit} className="space-y-4">
      {/* Mensajes de feedback */}
      {exito && (
        <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-sm font-medium text-emerald-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Modelo creado y catálogo actualizado
        </div>
      )}
      {errorLocal && (
        <div className="rounded border border-red-500/20 bg-red-500/10 p-2.5 text-sm font-medium text-red-400">
          ! {errorLocal}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

        {/* FABRICANTE CON DATALIST */}
        <div className="lg:col-span-1">
          <label htmlFor="marca" className={labelClasses}>Fabricante</label>
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

        {/* Aplicación */}
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

        {/* Vida Útil */}
        <div className="lg:col-span-1">
          <label htmlFor="vida_util_km" className={labelClasses}>Vida Útil (KM)</label>
          <input
            id="vida_util_km"
            name="vida_util_km"
            type="number"
            required
            min={1000}
            step={1000}
            placeholder="Ej: 120000"
            className={`${inputClasses} font-mono`}
          />
        </div>

        {/* Botón de envío usando mutation.isPending */}
        <div className="lg:col-span-1 pt-2 lg:pt-0">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full flex items-center justify-center rounded bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Guardando...
              </span>
            ) : (
              "Registrar"
            )}
          </button>
        </div>

      </div>
    </form>
  );
}