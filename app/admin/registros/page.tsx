import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Correcciones Operativas",
  description: "Gestión y edición manual de registros operativos del sistema",
};

export default function RegistrosOperativosDashboard() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Correcciones Operativas</h1>
          <p className="text-sm text-slate-400">Edición manual y rectificación de historiales</p>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-5xl mt-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Cargas de Combustible */}
          <Link
            href="/admin/registros/combustible"
            className="group rounded border border-white/5 bg-[#121214] p-5 transition-all hover:border-indigo-500/30 hover:bg-white/[0.02]"
          >
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded bg-indigo-600/20 text-indigo-400 transition-colors group-hover:bg-indigo-600/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-white">Cargas de Combustible</h3>
            <p className="mt-1 text-[11px] text-slate-400">Corrige litros o kilometrajes mal ingresados</p>
          </Link>

          {/* Movimientos Neumáticos */}
          <Link
            href="/admin/registros/neumaticos"
            className="group rounded border border-white/5 bg-[#121214] p-5 transition-all hover:border-violet-500/30 hover:bg-white/[0.02]"
          >
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded bg-violet-600/20 text-violet-400 transition-colors group-hover:bg-violet-600/30">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21" />
               </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-white">Movimientos Neumáticos</h3>
            <p className="mt-1 text-[11px] text-slate-400">Corrige profundidad de estría, odómetros o motivos</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
