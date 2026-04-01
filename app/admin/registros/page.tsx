import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Correcciones Operativas",
  description: "Gestión y edición manual de registros operativos del sistema",
};

export default function RegistrosOperativosDashboard() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-border-default pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">Correcciones Operativas</h1>
          <p className="text-sm text-zinc-400">Edición manual y rectificación de historiales</p>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-5xl mt-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Cargas de Combustible */}
          <Link
            href="/admin/registros/combustible"
            className="group rounded-xl border border-border-default bg-surface-card p-5 transition-all hover:border-border-strong hover:bg-surface-raised"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/8 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-foreground">Cargas de Combustible</h3>
            <p className="mt-1 text-[12px] text-zinc-400">Corrige litros o kilometrajes mal ingresados</p>
          </Link>

          {/* Movimientos Neumáticos */}
          <Link
            href="/admin/registros/neumaticos"
            className="group rounded-xl border border-border-default bg-surface-card p-5 transition-all hover:border-border-strong hover:bg-surface-raised"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/8 text-accent">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
               </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-foreground">Movimientos Neumáticos</h3>
            <p className="mt-1 text-[12px] text-zinc-400">Corrige profundidad de estría, odómetros o motivos</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
