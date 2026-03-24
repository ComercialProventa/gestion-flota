"use client";

import { useState } from "react";
import CombustibleForm from "../combustible-form";
import HistorialConductor from "./historial-conductor";

type Bus = { id: string; patente: string; foto_url?: string | null; capacidad_estanque?: number | null };
type HistorialCarga = {
  id: string;
  fecha: string;
  hora: string;
  kilometraje: number;
  litros_cargados: number;
  buses: { patente: string } | null;
};

export default function CombustibleCliente({ 
  buses, 
  historial, 
  rol 
}: { 
  buses: Bus[];
  historial: HistorialCarga[];
  rol: string;
}) {
  const [tab, setTab] = useState<"nueva" | "historial">("nueva");

  return (
    <div className="space-y-4">
      
      {/* Pestañas de Navegación */}
      <div className="flex bg-[#121214] rounded-xl border border-white/[0.06] p-1">
        <button
          onClick={() => setTab("nueva")}
          className={`flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-all ${
            tab === "nueva"
              ? "bg-amber-500/10 text-amber-500 shadow-sm"
              : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
          }`}
        >
          Nueva Carga
        </button>
        <button
          onClick={() => setTab("historial")}
          className={`flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-all ${
            tab === "historial"
              ? "bg-white/10 text-white shadow-sm"
              : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
          }`}
        >
          Mi Historial
        </button>
      </div>

      {/* Contenido Dinámico */}
      {tab === "nueva" ? (
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              </svg>
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-white leading-tight">Carga de Combustible</h2>
              <p className="text-[11px] text-white/40 leading-tight">
                {rol === "conductor" ? "Selecciona el bus asignado" : "Ingresa los datos para registrar la carga"}
              </p>
            </div>
          </div>
          <CombustibleForm buses={buses} />
        </section>
      ) : (
        <section className="animate-in fade-in zoom-in-95 duration-200">
          <HistorialConductor historial={historial} />
        </section>
      )}

    </div>
  );
}
