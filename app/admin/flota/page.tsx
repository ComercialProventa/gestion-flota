import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import FlotaLista from "./flota-lista";
import LoadingFlota from "./loading";

export const metadata: Metadata = {
  title: "Maestro de Flota | Administración",
};

async function FlotaData() {
  const supabase = await createClient();

  // Consulta optimizada
  const { data: unidades } = await supabase
    .from("buses")
    .select("id, patente, marca, modelo, ano, chasis, foto_url, vencimiento_revision_tecnica, vencimiento_seguro, capacidad_estanque")
    .order("patente", { ascending: true });

  const flota = unidades || [];

  if (flota.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-lg border border-dashed border-white/10 bg-white/[0.02]">
        <div className="flex h-12 w-12 items-center justify-center rounded bg-white/5 text-slate-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-slate-300">No hay unidades registradas</h3>
        <p className="mt-1 text-xs text-slate-500 mb-6">Comienza agregando el primer bus o camión a la flota.</p>
        <Link href="/admin/flota/nuevo" className="rounded bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors border border-white/10">
          Registrar Unidad
        </Link>
      </div>
    );
  }

  return <FlotaLista unidades={flota} />;
}

export default function FlotaPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">

      {/* Encabezado de Sección */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Maestro de Flota</h1>
          <p className="mt-1 text-sm text-slate-400">
            Cargando unidades...
          </p>
        </div>

        <Link
          href="/admin/flota/nuevo"
          className="flex items-center justify-center gap-2 rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva Unidad
        </Link>
      </div>

      {/* Contenido Principal con Suspense */}
      <Suspense fallback={<LoadingFlota isNested={true} />}>
        <FlotaData />
      </Suspense>
    </main>
  );
}