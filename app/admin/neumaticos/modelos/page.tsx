import type { Metadata } from "next";
import Link from "next/link";
import ModeloForm from "./modelo-form";
import ListaModelos from "./lista-modelos";

export const metadata: Metadata = {
  title: "Gestión de Modelos | Administración",
  description: "Gestión avanzada de modelos de neumáticos",
};

export default function ModelosNeumaticosPage() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/neumaticos/inventario"
            className="flex h-8 w-8 items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-foreground">Catálogo de Modelos</h1>
            <p className="text-[13px] text-muted mt-0.5">Gestiona los modelos disponibles para añadir al inventario.</p>
          </div>
        </div>
      </header>

      <main className="px-8 pb-12 space-y-6">
        <ModeloForm />
        <ListaModelos />
      </main>
    </div>
  );
}
