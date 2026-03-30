"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBusesParaCombustible, getHistorialCombustible, getPerfilOperario } from "../actions";
import CombustibleForm from "../combustible-form";
import HistorialConductor from "./historial-conductor";
import OperacionesShell from "../operaciones-shell";

export default function CombustibleCliente() {
  const { data: perfil, isLoading: loadingPerfil } = useQuery({
    queryKey: ["perfil_operario"],
    queryFn: getPerfilOperario,
    staleTime: 1000 * 60 * 10,
  });

  const { data: busesData, isLoading: loadingBuses } = useQuery({
    queryKey: ["buses_combustible"],
    queryFn: getBusesParaCombustible,
    staleTime: 1000 * 60 * 5,
  });

  const { data: historial, isLoading: loadingHistorial } = useQuery({
    queryKey: ["historial_combustible"],
    queryFn: getHistorialCombustible,
    staleTime: 1000 * 60 * 2,
  });

  const [tab, setTab] = useState<"nueva" | "historial">("nueva");

  if (loadingPerfil || loadingBuses || loadingHistorial || !perfil) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="flex flex-col items-center text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-4"></div>
          <p className="text-sm font-bold animate-pulse uppercase tracking-widest">Cargando...</p>
        </div>
      </div>
    );
  }

  const rol = busesData?.rol || perfil.rol;
  const buses = busesData?.buses || [];
  const nombreCorto = perfil.nombre;

  return (
    <OperacionesShell
      backHref="/operaciones"
      rol={rol}
      title="COMBUSTIBLE"
      subtitle={rol === "conductor" ? `OPERADOR: ${nombreCorto}` : "TERMINAL DE CARGA"}
    >
      <div className="pb-10">
        <div className="animate-in fade-in duration-500">

          {/* ─── Navegación Técnica ─── */}
          <div className="flex border-b border-white/10 mb-8">
            <button
              onClick={() => setTab("nueva")}
              className={`flex-1 h-14 text-[14px] font-black uppercase tracking-[0.2em] transition-all relative ${tab === "nueva" ? "text-amber-500" : "text-white/40"}`}
            >
              NUEVA CARGA
              {tab === "nueva" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />}
            </button>
            <button
              onClick={() => setTab("historial")}
              className={`flex-1 h-14 text-[14px] font-black uppercase tracking-[0.2em] transition-all relative ${tab === "historial" ? "text-white" : "text-white/40"}`}
            >
              HISTORIAL
              {tab === "historial" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white" />}
            </button>
          </div>

          <div className="min-h-[350px]">
            {tab === "nueva" ? (
              <div className="animate-in slide-in-from-right-2 duration-300 px-1">
                <CombustibleForm buses={buses} userId={perfil.userId} />
              </div>
            ) : (
              <div className="animate-in slide-in-from-left-2 duration-300 px-1">
                <HistorialConductor historial={(historial as any) || []} />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-12 pt-4 border-t border-white/5 opacity-30">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Enlace Activo</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Punta Arenas</span>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-white/5 pt-6 opacity-20">
        <p className="text-[9px] font-mono text-center uppercase tracking-[0.2em] text-slate-500 leading-relaxed">
          SISTEMA DE CONTROL DE ENERGÍA <br />
          ZONA MAGALLANES · PUNTA ARENAS
        </p>
      </div>
    </OperacionesShell>
  );
}
