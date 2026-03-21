import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ChasisPreview from "@/components/buses/chasis-preview";
import { EJES_LABEL } from "@/components/buses/chasis-preview";
import DocumentProgressBar from "@/components/ui/DocumentProgressBar";

export const metadata: Metadata = {
  title: "Detalle de Unidad | Maestro de Flota",
  description: "Ficha detallada de la unidad vehicular",
};

export default async function UnidadDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: unidad, error } = await supabase
    .from("buses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !unidad) notFound();

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/admin/flota" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </a>
            <div>
              <h1 className="text-lg font-semibold text-white font-mono tracking-wider">{unidad.patente}</h1>
              <p className="text-xs text-slate-400">{unidad.marca} {unidad.modelo}</p>
            </div>
          </div>
          <a
            href={`/admin/flota/${unidad.id}/editar`}
            className="flex items-center gap-2 rounded-xl bg-sky-600/20 px-4 py-2 text-sm font-medium text-sky-400 hover:bg-sky-600/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            Editar
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        {/* Info General + Chasis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300">Información General</h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Patente" value={unidad.patente} mono />
              <InfoItem label="Marca" value={unidad.marca} />
              <InfoItem label="Modelo" value={unidad.modelo} />
              <InfoItem label="Año" value={String(unidad.ano)} />
              <InfoItem label="Asientos" value={String(unidad.asientos)} />
              <InfoItem label="Ejes" value={EJES_LABEL[unidad.chasis] || unidad.chasis} />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Configuración de Ejes</h2>
            <div className="rounded-xl bg-slate-900/50 p-4">
              <ChasisPreview tipo={unidad.chasis || "2_ejes_6_ruedas"} />
            </div>
          </div>
        </div>

        {/* Vigencias */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Vigencias Legales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-900/40 p-4">
              <DocumentProgressBar nombre="Revisión Técnica" fechaVencimiento={unidad.vencimiento_revision_tecnica} />
              {unidad.vencimiento_revision_tecnica && (
                <p className="mt-2 text-[10px] text-slate-600">
                  Vence: {new Date(unidad.vencimiento_revision_tecnica).toLocaleDateString("es-CL")}
                </p>
              )}
            </div>
            <div className="rounded-xl bg-slate-900/40 p-4">
              <DocumentProgressBar nombre="Seguro Obligatorio" fechaVencimiento={unidad.vencimiento_seguro} />
              {unidad.vencimiento_seguro && (
                <p className="mt-2 text-[10px] text-slate-600">
                  Vence: {new Date(unidad.vencimiento_seguro).toLocaleDateString("es-CL")}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center gap-6 pt-2 border-t border-slate-700/30">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> &gt; 30 días
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> 11–30 días
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-red-500" /> ≤ 10 días
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600">
          Registrada el {unidad.creado_en ? new Date(unidad.creado_en).toLocaleDateString("es-CL") : "—"}
        </p>
      </main>
    </div>
  );
}

function InfoItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold text-white ${mono ? "font-mono tracking-wider" : ""}`}>{value}</p>
    </div>
  );
}
