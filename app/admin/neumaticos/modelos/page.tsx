import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ModeloForm from "./modelo-form";
import EliminarModeloBtn from "./eliminar-modelo-btn";

export const metadata: Metadata = {
  title: "Modelos de Neumáticos | Administración",
  description: "Gestión de modelos base de neumáticos",
};

/**
 * CRUD de Modelos de Neumáticos — Server Component.
 *
 * Consulta todos los modelos desde Supabase y los renderiza en una tabla.
 * En la parte superior tiene el formulario inline para agregar nuevos.
 * Cada fila tiene un botón de eliminar (Client Component).
 */
export default async function ModelosNeumaticosPage() {
  const supabase = await createClient();

  const { data: modelos } = await supabase
    .from("modelos_neumaticos")
    .select("*")
    .order("marca", { ascending: true });

  const lista = modelos || [];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
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
              <h1 className="text-lg font-semibold text-white">Modelos de Neumáticos</h1>
              <p className="text-xs text-slate-400">{lista.length} {lista.length === 1 ? "modelo" : "modelos"} registrados</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        {/* Formulario para agregar modelo */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Agregar Nuevo Modelo
          </h2>
          <ModeloForm />
        </div>

        {/* Tabla de modelos existentes */}
        {lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 py-12 text-center">
            <p className="text-sm text-slate-500">No hay modelos registrados aún.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 text-left">
                    <th className="px-5 py-3 font-medium text-slate-400">Marca</th>
                    <th className="px-5 py-3 font-medium text-slate-400">Medida</th>
                    <th className="px-5 py-3 font-medium text-slate-400 text-right">Vida Útil</th>
                    <th className="px-5 py-3 font-medium text-slate-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((m) => (
                    <tr key={m.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="px-5 py-3 font-semibold text-white">{m.marca}</td>
                      <td className="px-5 py-3 font-mono text-slate-300">{m.medida}</td>
                      <td className="px-5 py-3 text-right text-slate-300">
                        {m.vida_util_km.toLocaleString("es-CL")} km
                      </td>
                      <td className="px-5 py-3 text-right">
                        <EliminarModeloBtn modeloId={m.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
