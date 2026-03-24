import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Administrativo | Gestión de Flota",
  description: "Panel de control del área administrativa",
};

/**
 * Dashboard Administrativo — Server Component.
 *
 * Página principal para los usuarios con rol "administrativo".
 * Acceso a funciones de gestión documental, permisos, seguros, etc.
 */
export default function AdministrativoDashboard() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white">Panel Administrativo</h1>
          </div>
          <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-400">
            Administrativo
          </span>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold text-white">Bienvenido al panel administrativo</h2>
        <p className="text-slate-400">Los módulos administrativos estarán disponibles próximamente.</p>
      </main>
    </div>
  );
}
