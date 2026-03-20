import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operaciones | Gestión de Flota",
  description: "Panel de operaciones para taller y conductores",
};

/**
 * Dashboard de Operaciones — Server Component.
 *
 * Página principal para los usuarios con rol "taller_conductor".
 * Acceso a funciones de mantenimiento, checklists diarios, reportes de incidentes, etc.
 */
export default function OperacionesDashboard() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600/20 text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.385 3.07A.75.75 0 015 17.655V5.846a.75.75 0 01.386-.66l5.386-3.07a.75.75 0 01.728 0l5.386 3.07a.75.75 0 01.386.66v11.81a.75.75 0 01-1.035.684l-5.385-3.07a.75.75 0 00-.728 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white">Operaciones</h1>
          </div>
          <span className="rounded-full bg-amber-600/10 px-3 py-1 text-xs font-medium text-amber-400">
            Taller / Conductor
          </span>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold text-white">Bienvenido al panel de operaciones</h2>
        <p className="text-slate-400">Los módulos de operaciones estarán disponibles próximamente.</p>
      </main>
    </div>
  );
}
