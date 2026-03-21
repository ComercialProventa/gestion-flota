import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import CombustibleForm from "./combustible-form";

export const metadata: Metadata = {
  title: "Operaciones | Gestión de Flota",
  description: "Panel de operaciones para taller y conductores",
};

/**
 * Dashboard de Operaciones — Server Component.
 *
 * Página principal para el rol "taller_conductor".
 *
 * Al ser un Server Component, podemos:
 * 1. Hacer la consulta a Supabase directamente en el servidor (sin fetch)
 * 2. Pasar los datos como props al Client Component (CombustibleForm)
 * 3. No exponer la lógica de consulta al navegador
 *
 * Consulta la tabla `buses` para obtener id y patente, que se usan
 * para poblar el selector del formulario de combustible.
 */
export default async function OperacionesDashboard() {
  const supabase = await createClient();

  // Obtener lista de buses (id y patente) desde Supabase
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600/20 text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white">Operaciones</h1>
          </div>
          <span className="rounded-full bg-amber-600/10 px-3 py-1 text-xs font-medium text-amber-400">
            Taller / Conductor
          </span>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Sección: Registro de Combustible */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Registro de Combustible</h2>
              <p className="text-sm text-slate-400">Ingresa los datos de la carga</p>
            </div>
          </div>

          {/* Formulario (Client Component) */}
          <CombustibleForm buses={buses || []} />
        </div>

        {/* Sección: Acceso a Taller */}
        <a
          href="/operaciones/taller/rotacion"
          className="mt-6 flex items-center gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 transition-all hover:border-amber-500/30 hover:bg-slate-800 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 transition-colors group-hover:bg-amber-600/30 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M4.031 9.865l-.001.001" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Rotación de Neumáticos</h3>
            <p className="text-sm text-slate-400">Rotar, intercambiar o dar de baja neumáticos</p>
          </div>
        </a>

        {/* Sección: Inventario de Neumáticos */}
        <a
          href="/operaciones/taller/inventario"
          className="flex items-center gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 transition-all hover:border-amber-500/30 hover:bg-slate-800 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 transition-colors group-hover:bg-amber-600/30 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Ingreso de Neumáticos</h3>
            <p className="text-sm text-slate-400">Registrar neumáticos nuevos al inventario</p>
          </div>
        </a>

        {/* Sección: Mantenimiento y Repuestos */}
        <a
          href="/operaciones/mantenimiento"
          className="mt-6 flex items-center gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 transition-all hover:border-sky-500/30 hover:bg-slate-800 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600/20 text-sky-400 transition-colors group-hover:bg-sky-600/30 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M15.17 11.42L21 5.58A2.652 2.652 0 0017.25 1.83l-5.83 5.83" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11l-3 3-5-5-3 3a1.414 1.414 0 002 2l3-3 5 5 3-3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Registro de Mantenimiento</h3>
            <p className="text-sm text-slate-400">Ingresar repuestos y servicios por unidad</p>
          </div>
        </a>
      </main>
    </div>
  );
}
