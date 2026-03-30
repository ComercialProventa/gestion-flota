import type { Metadata } from "next";
import Link from "next/link";
import InventarioAdminTable from "./inventario-admin-table";
import { obtenerModelosNeumaticos } from "./actions";

export const metadata: Metadata = {
  title: "Inventario de Neumáticos | Administración",
  description: "DataGrid avanzado de inventario de neumáticos con filtros y trazabilidad",
};

export default async function InventarioAdminPage() {
  const modelos = await obtenerModelosNeumaticos();

  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/neumaticos"
              className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-white">Inventario de Neumáticos</h1>
              <p className="text-xs text-slate-400">Gestión centralizada de llantas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/neumaticos/modelos"
              className="rounded-lg border border-sky-600/30 bg-sky-600/10 px-3 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-600/20 transition-colors"
            >
              Modelos
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-7xl">
        <InventarioAdminTable modelos={modelos} />
      </main>
    </div>
  );
}
