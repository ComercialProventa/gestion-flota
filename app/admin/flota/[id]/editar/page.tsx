import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditarUnidadForm from "./editar-unidad-form";

export const metadata: Metadata = {
  title: "Editar Unidad | Maestro de Flota",
  description: "Actualizar datos de la unidad vehicular",
};

export default async function EditarUnidadPage({
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
      <header className="border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <a href="/admin/flota" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </a>
            <div>
              <h1 className="text-lg font-semibold text-white">Editar Unidad</h1>
              <p className="text-xs text-slate-400 font-mono tracking-wider">{unidad.patente}</p>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <EditarUnidadForm unidad={unidad} />
      </main>
    </div>
  );
}
