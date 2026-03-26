import type { Metadata } from "next";
import NuevoBusForm from "./nuevo-bus-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nuevo Bus | Gestión de Flota",
  description: "Registrar un nuevo bus con configuración de chasis",
};

/**
 * Página de creación de bus — Server Component.
 *
 * Solo sirve como wrapper que monta el formulario Client Component
 * con la previsualización interactiva del chasis.
 */
export default function NuevoBusPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/buses"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-white">Nuevo Bus</h1>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <NuevoBusForm />
      </main>
    </div>
  );
}
