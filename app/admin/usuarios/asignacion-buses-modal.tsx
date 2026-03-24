"use client";

import { useState, useEffect } from "react";
import { type Usuario } from "@/components/usuarios/usuarios-table";
import { obtenerBusesYAsignaciones, toggleAsignacionBus } from "./asignacion-actions";

interface Bus {
  id: string;
  patente: string;
  modelo: string | null;
}

export default function AsignacionBusesModal({
  usuario,
  onCerrar,
}: {
  usuario: Usuario;
  onCerrar: () => void;
}) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [asignados, setAsignados] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await obtenerBusesYAsignaciones(usuario.id);
      if (res.error) {
        setError(res.error);
      } else {
        setBuses(res.buses || []);
        setAsignados(new Set(res.asignadosIds || []));
      }
      setLoading(false);
    }
    load();
  }, [usuario.id]);

  async function handleToggle(busId: string, actualValue: boolean) {
    const newVal = !actualValue;
    // Optimistic UI update
    setAsignados((prev) => {
      const next = new Set(prev);
      if (newVal) next.add(busId);
      else next.delete(busId);
      return next;
    });

    const res = await toggleAsignacionBus(usuario.id, busId, newVal);
    if (res.error) {
      // Revert if error
      setError(res.error);
      setAsignados((prev) => {
        const next = new Set(prev);
        if (!newVal) next.add(busId);
        else next.delete(busId);
        return next;
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700/50 bg-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[17px] font-bold text-white leading-tight">Asignación de Flota</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {usuario.nombre_completo}
                {usuario.rol === "taller_conductor" && (
                  <span className="ml-1 text-amber-500/80">(Rol Taller ve todo por defecto)</span>
                )}
              </p>
            </div>
            <button type="button" onClick={onCerrar} className="text-slate-500 hover:text-white transition-colors cursor-pointer p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Listado de Buses */}
        <div className="flex-1 overflow-y-auto p-2">
          {error && (
            <div className="m-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-400">
              ! {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-8">
              <svg className="animate-spin h-6 w-6 text-indigo-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {buses.map((bus) => {
                const isAsignado = asignados.has(bus.id);
                return (
                  <button
                    key={bus.id}
                    type="button"
                    onClick={() => handleToggle(bus.id, isAsignado)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer border ${
                      isAsignado
                        ? "bg-indigo-500/10 border-indigo-500/30"
                        : "bg-transparent border-transparent hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-mono text-sm font-bold text-white tracking-widest">{bus.patente}</span>
                      {bus.modelo && <span className="text-xs text-slate-500">{bus.modelo}</span>}
                    </div>
                    <div className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                      isAsignado ? "bg-indigo-600 border-indigo-500" : "border-slate-600"
                    }`}>
                      {isAsignado && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 shrink-0">
          <button
            type="button"
            onClick={onCerrar}
            className="w-full rounded-xl bg-slate-700/80 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
