import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import FlotaLista from "./flota-lista";

export const metadata: Metadata = {
  title: "Maestro de Flota | Administración",
  description: "Gestión de unidades vehiculares — buses y camiones",
};

/**
 * Maestro de Flota — Server Component.
 *
 * Lista todas las unidades (buses/camiones) con indicadores compactos
 * de vigencia, acciones CRUD, y quick-action de renovación.
 */
export default async function FlotaPage() {
  const supabase = await createClient();

  const { data: unidades } = await supabase
    .from("buses")
    .select("*")
    .order("patente", { ascending: true });

  const flota = unidades || [];

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </a>
            <div>
              <h1 className="text-lg font-semibold text-white">Maestro de Flota</h1>
              <p className="text-xs text-slate-400">{flota.length} {flota.length === 1 ? "unidad" : "unidades"} registradas</p>
            </div>
          </div>
          <a
            href="/admin/flota/nuevo"
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-500 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva Unidad
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {flota.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Sin unidades registradas</h3>
            <p className="text-sm text-slate-400 mb-6">Registra tu primera unidad para comenzar.</p>
            <a href="/admin/flota/nuevo" className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition-colors">
              Registrar Primera Unidad
            </a>
          </div>
        ) : (
          <FlotaLista unidades={flota} />
        )}
      </main>
    </div>
  );
}
