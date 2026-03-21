import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ChasisPreview from "@/components/buses/chasis-preview";
import DocumentProgressBar from "@/components/ui/DocumentProgressBar";

export const metadata: Metadata = {
  title: "Flota de Buses | Administración",
  description: "Vista general de todos los buses registrados en la flota",
};

/**
 * Vista General de la Flota — Server Component.
 *
 * Consulta todos los buses de Supabase y los renderiza en cards modernas
 * con barras de progreso para vigencias legales (Revisión Técnica, Seguro).
 */
export default async function FlotaBusesPage() {
  const supabase = await createClient();

  const { data: buses } = await supabase
    .from("buses")
    .select("*")
    .order("patente", { ascending: true });

  const flota = buses || [];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
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
              <h1 className="text-lg font-semibold text-white">Flota de Buses</h1>
              <p className="text-xs text-slate-400">{flota.length} {flota.length === 1 ? "bus" : "buses"} registrados</p>
            </div>
          </div>
          <a
            href="/admin/buses/nuevo"
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-500 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Bus
          </a>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        {flota.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Sin buses registrados</h3>
            <p className="text-sm text-slate-400 mb-6">Registra tu primer bus para comenzar.</p>
            <a
              href="/admin/buses/nuevo"
              className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition-colors"
            >
              Registrar Primer Bus
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flota.map((bus) => (
              <a
                key={bus.id}
                href={`/admin/buses/${bus.id}`}
                className="block rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 transition-all hover:border-sky-500/30 hover:bg-slate-800 group"
              >
                {/* Header de la card */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-lg font-bold text-white tracking-wider group-hover:text-sky-400 transition-colors">
                      {bus.patente}
                    </p>
                    <p className="text-sm text-slate-400">
                      {bus.marca} {bus.modelo} · {bus.ano}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-700/60 px-3 py-1 text-xs font-medium text-slate-300">
                    {bus.asientos} asientos
                  </span>
                </div>

                {/* Previsualización del chasis en miniatura */}
                <div className="rounded-xl bg-slate-900/50 p-3 mb-4 overflow-x-auto">
                  <ChasisPreview tipo={bus.chasis || "estandar_6"} compact />
                </div>

                {/* Barras de progreso de vigencia */}
                <div className="space-y-3">
                  <DocumentProgressBar
                    nombre="Revisión Técnica"
                    fechaVencimiento={bus.vencimiento_revision_tecnica}
                  />
                  <DocumentProgressBar
                    nombre="Seguro Obligatorio"
                    fechaVencimiento={bus.vencimiento_seguro}
                  />
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
