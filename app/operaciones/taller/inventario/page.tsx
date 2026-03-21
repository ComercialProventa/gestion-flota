import type { Metadata } from "next";
import InventarioForm from "./inventario-form";

export const metadata: Metadata = {
  title: "Ingreso al Inventario | Taller",
  description: "Registro de neumáticos nuevos al inventario del taller",
};

/**
 * Página de Ingreso al Inventario — Server Component.
 *
 * Ruta: /operaciones/taller/inventario
 * Accesible por el rol taller_conductor.
 *
 * Monta el formulario mobile-first para que el mecánico registre
 * neumáticos nuevos que llegan al taller.
 */
export default function InventarioPage() {
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
            <h1 className="text-lg font-semibold text-white">Inventario</h1>
          </div>
          <span className="rounded-full bg-amber-600/10 px-3 py-1 text-xs font-medium text-amber-400">
            Ingreso de Neumáticos
          </span>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Registrar Neumático Nuevo</h2>
              <p className="text-sm text-slate-400">Ingresa los datos del neumático recibido</p>
            </div>
          </div>

          <InventarioForm />
        </div>
      </main>
    </div>
  );
}
