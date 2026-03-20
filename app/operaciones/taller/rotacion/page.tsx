import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ChasisInteractivo from "./chasis-interactivo";

export const metadata: Metadata = {
  title: "Rotación de Neumáticos | Taller",
  description: "Gestión visual de neumáticos — rotación y baja",
};

/**
 * Página de Rotación de Neumáticos — Server Component.
 *
 * Consulta la lista de buses desde Supabase y la pasa al Client Component
 * interactivo. La interfaz del chasis con toda la lógica de interacción
 * vive en <ChasisInteractivo />.
 */
export default async function RotacionPage() {
  const supabase = await createClient();

  const { data: buses } = await supabase
    .from("buses")
    .select("id, patente")
    .order("patente", { ascending: true });

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a
              href="/operaciones"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </a>
            <h1 className="text-lg font-semibold text-white">Neumáticos</h1>
          </div>
          <span className="rounded-full bg-amber-600/10 px-3 py-1 text-xs font-medium text-amber-400">
            Rotación / Baja
          </span>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M4.031 9.865l-.001.001" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Rotación y Baja</h2>
              <p className="text-sm text-slate-400">Selecciona un bus para gestionar sus neumáticos</p>
            </div>
          </div>

          {/* Chasis Interactivo (Client Component) */}
          <ChasisInteractivo buses={buses || []} />
        </div>
      </main>
    </div>
  );
}
