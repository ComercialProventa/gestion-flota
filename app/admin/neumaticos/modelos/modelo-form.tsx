"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearModelo } from "./actions";

const MARCAS_SUGERIDAS = ["Michelin", "Bridgestone", "Goodyear", "Pirelli", "Firestone", "Continental", "Fate", "Triangle"];
const MEDIDAS_SUGERIDAS = ["295/80R22.5", "275/80R22.5", "315/80R22.5", "12R22.5", "11R22.5"];

export default function ModeloForm() {
  const queryClient = useQueryClient();
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => crearModelo(formData),
    onSuccess: (result) => {
      if (result.error) {
        setErrorLocal(result.error);
        return;
      }

      setExito(true);
      setErrorLocal(null);

      const form = document.getElementById("modelo-form") as HTMLFormElement;
      form?.reset();

      queryClient.invalidateQueries({ queryKey: ["modelos_neumaticos"] });

      setTimeout(() => setExito(false), 3000);
    },
    onError: () => {
      setErrorLocal("Ocurrió un fallo de conexión con el servidor.");
    }
  });

  async function handleSubmit(formData: FormData) {
    setExito(false);
    setErrorLocal(null);
    mutation.mutate(formData);
  }

  const inputClasses =
    "w-full rounded-md bg-surface px-3 py-2 text-[13px] text-foreground placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-accent/30";

  const labelClasses = "block text-[11px] font-medium text-dim mb-1";

  return (
    <form id="modelo-form" action={handleSubmit} className="space-y-4">
      {exito && (
        <div className="text-sm text-green flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Modelo creado y catálogo actualizado
        </div>
      )}
      {errorLocal && (
        <div className="text-sm text-red">
          {errorLocal}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

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

        <div className="lg:col-span-1">
          <label htmlFor="aplicacion_eje" className={labelClasses}>Aplicación</label>
          <select id="aplicacion_eje" name="aplicacion_eje" required className={inputClasses}>
            <option value="">Seleccionar...</option>
            <option value="direccional">Direccional</option>
            <option value="traccion">Tracción</option>
            <option value="remolque">Remolque / Trailer</option>
            <option value="toda_posicion">Toda Posición</option>
          </select>
        </div>

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

        <div className="lg:col-span-1 pt-2 lg:pt-0">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full flex items-center justify-center bg-accent text-background rounded-md px-4 py-2.5 text-[13px] font-medium hover:bg-accent-hover disabled:opacity-50 transition-colors cursor-pointer"
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-background" viewBox="0 0 24 24">
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
