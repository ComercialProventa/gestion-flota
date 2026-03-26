import type { Metadata } from "next";
import Link from "next/link";
import ModeloForm from "./modelo-form";
import ListaModelos from "./lista-modelos";

export const metadata: Metadata = {
  title: "Gestión de Modelos | Administración",
  description: "Gestión avanzada de modelos de neumáticos",
};

// Ya no es 'async', por lo que no bloquea la sidebar
export default function ModelosNeumaticosPage() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased bg-[#0a0a0a]">
      <main className="mx-auto max-w-6xl w-full space-y-6">

        {/* Encabezado Principal (Se renderiza al instante) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-5">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/neumaticos/inventario"
              className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Catálogo de Modelos</h1>
              <p className="mt-1 text-sm text-slate-400">Gestiona los modelos disponibles para añadir al inventario.</p>
            </div>
          </div>
        </div>

        {/* Formulario (Client Component) */}
        <section className="rounded-lg border border-white/10 bg-[#151517] p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-sky-500/10 text-sky-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Nuevo Modelo</h2>
              <p className="text-[11px] text-slate-400">Agregar a la base de datos maestra</p>
            </div>
          </div>
          <ModeloForm />
        </section>

        {/* La Lista (Client Component con React Query interno) */}
        <ListaModelos />

      </main>
    </div>
  );
}