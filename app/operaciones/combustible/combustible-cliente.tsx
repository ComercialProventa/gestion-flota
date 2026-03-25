"use client";

import { useState } from "react";
import CombustibleForm from "../combustible-form";
import HistorialConductor from "./historial-conductor";

type Bus = {
  id: string;
  patente: string;
  foto_url?: string | null;
  capacidad_estanque?: number | null
};

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
  rol,
  userId
}: {
  buses: Bus[];
  historial: HistorialCarga[];
  rol: string;
  userId?: string;
}) {
  const [tab, setTab] = useState<"nueva" | "historial">("nueva");

  return (
    <div className="animate-in fade-in duration-500">

      {/* ─── Navegación Técnica (Tamaño optimizado para dedos grandes) ─── */}
      <div className="flex border-b border-white/10 mb-8">
        <button
          onClick={() => setTab("nueva")}
          className={`flex-1 h-14 text-[14px] font-black uppercase tracking-[0.2em] transition-all relative ${tab === "nueva" ? "text-amber-500" : "text-white/40"
            }`}
        >
          NUEVA CARGA
          {tab === "nueva" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
          )}
        </button>

        <button
          onClick={() => setTab("historial")}
          className={`flex-1 h-14 text-[14px] font-black uppercase tracking-[0.2em] transition-all relative ${tab === "historial" ? "text-white" : "text-white/40"
            }`}
        >
          HISTORIAL
          {tab === "historial" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white" />
          )}
        </button>
      </div>

      {/* ─── Área de Operación Directa (Sin envoltorios) ─── */}
      <div className="min-h-[350px]">
        {tab === "nueva" ? (
          <div className="animate-in slide-in-from-right-2 duration-300 px-1">
            {/* Llamamos al Formulario. 
                El operario ya sabe que es Combustible por el Header de la página.
            */}
            <CombustibleForm buses={buses} userId={userId} />
          </div>
        ) : (
          <div className="animate-in slide-in-from-left-2 duration-300 px-1">
            <HistorialConductor historial={historial} />
          </div>
        )}
      </div>

      {/* ─── Barra de Estado (Legibilidad Industrial) ─── */}
      <div className="flex items-center justify-between mt-12 pt-4 border-t border-white/5 opacity-30">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            Enlace Activo
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
          Punta Arenas
        </span>
      </div>

    </div>
  );
}