"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getPerfilOperario } from "./actions";
import OperacionesShell from "./operaciones-shell";

export default function OperacionesDashboard() {
  const { data: perfil, isLoading, isError } = useQuery({
    queryKey: ["perfil_operario"],
    queryFn: getPerfilOperario,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="flex flex-col items-center text-center text-slate-500 p-8">
          <p className="text-sm font-bold uppercase tracking-widest mb-4">Error al cargar</p>
          <a href="/login" className="text-amber-500 underline text-xs">Reintentar sesión</a>
        </div>
      </div>
    );
  }

  if (isLoading || !perfil) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="flex flex-col items-center text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-4"></div>
          <p className="text-sm font-bold animate-pulse uppercase tracking-widest">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <OperacionesShell
      rol={perfil.rol}
      title="CENTRAL"
      subtitle={`OP: ${perfil.nombre}`}
    >
      <div className="space-y-4 antialiased">

        {/* ─── BOTÓN PRINCIPAL: COMBUSTIBLE ─── */}
        <div className="pt-2">
          <DashboardButton
            href="/operaciones/combustible"
            title="CARGAR PETRÓLEO"
            color="bg-amber-500"
            icon={(
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              </svg>
            )}
          />
        </div>

        {/* ─── BOTONES DE TALLER (Solo si no es conductor) ─── */}
        {perfil.rol !== "conductor" && (
          <div className="space-y-4">
            <DashboardButton
              href="/operaciones/taller/rotacion"
              title="ROTACIÓN NEUMÁTICOS"
              color="bg-orange-600"
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              )}
            />

            <DashboardButton
              href="/operaciones/taller/inventario"
              title="BODEGA / STOCK"
              color="bg-emerald-600"
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              )}
            />
          </div>
        )}

        <div className="pt-8 opacity-20">
          <p className="text-center font-mono text-[10px] uppercase tracking-widest text-slate-500">
            PROVENTA SISTEMAS · v2.4
          </p>
        </div>
      </div>
    </OperacionesShell>
  );
}

// ─── COMPONENTE: EL BOTÓN INDUSTRIAL ───

function DashboardButton({ href, title, color, icon }: { href: string; title: string; color: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`group relative flex h-28 w-full items-center gap-6 overflow-hidden rounded-sm border-b-4 border-black/20 ${color} p-6 active:translate-y-1 active:border-b-0 transition-all`}
    >
      {/* Icono grande y sólido */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm bg-black/10 text-black/80">
        {icon}
      </div>

      <div className="flex flex-col">
        <h2 className="text-[20px] font-black uppercase tracking-tighter leading-tight text-black/90">
          {title}
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
          Tocar para ingresar
        </span>
      </div>

      {/* Indicador de flecha para guiar el ojo */}
      <div className="absolute right-6 opacity-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
