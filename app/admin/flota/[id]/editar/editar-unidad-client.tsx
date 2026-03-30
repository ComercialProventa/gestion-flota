"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import EditarUnidadForm from "./editar-unidad-form";
import { getUnidadById } from "../../actions";

export default function EditarUnidadClient({ id }: { id: string }) {
  const { data: unidad, isLoading, isError, error } = useQuery({
    queryKey: ["unidad", id],
    queryFn: () => getUnidadById(id),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent mb-4"></div>
          <p className="text-sm font-medium animate-pulse">Cargando unidad...</p>
        </div>
      </main>
    );
  }

  if (isError || !unidad) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          Error al cargar la unidad: {error?.message || "No encontrada"}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-6 antialiased">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <Link
          href="/admin/flota"
          className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Volver al listado"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Editar Ficha de Unidad</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Modificando registro de la patente: <span className="font-mono font-semibold text-sky-400 uppercase">{unidad.patente}</span>
          </p>
        </div>
      </div>

      <section className="rounded-lg border border-white/10 bg-[#151517] p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-sky-500/10 text-sky-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Información del Vehículo</h2>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">Actualiza los datos técnicos y vigencias</p>
          </div>
        </div>

        <EditarUnidadForm unidad={unidad} />
      </section>

      <footer className="pt-4 text-center">
        <p className="text-[10px] font-medium uppercase tracking-widest text-slate-600">
          Maestro de Flota Proventa · Edición de Activos
        </p>
      </footer>
    </main>
  );
}
