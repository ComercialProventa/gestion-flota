import type { Metadata } from "next";
import Link from "next/link";
import NuevaUnidadForm from "./nueva-unidad-form";

export const metadata: Metadata = {
  title: "Nueva Unidad | Maestro de Flota",
  description: "Registrar una nueva unidad vehicular en la flota",
};

export default function NuevaUnidadPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-6 antialiased">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <Link
          href="/admin/flota"
          className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Volver al listado"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Registrar Nueva Unidad</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Añade un nuevo bus o camión al inventario maestro de la empresa.
          </p>
        </div>
      </div>

      <section className="rounded-lg border border-white/10 bg-[#151517] p-6 shadow-sm">
        <NuevaUnidadForm />
      </section>
    </main>
  );
}
