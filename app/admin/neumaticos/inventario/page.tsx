import type { Metadata } from "next";
import Link from "next/link";
import InventarioAdminTable from "./inventario-admin-table";
import { obtenerModelosNeumaticos } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inventario de Neumáticos | Administración",
  description: "DataGrid avanzado de inventario de neumáticos con filtros y trazabilidad",
};

export default async function InventarioAdminPage() {
  const modelos = await obtenerModelosNeumaticos();

  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/neumaticos"
            className="flex h-8 w-8 items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-foreground">Inventario de Neumáticos</h1>
            <p className="text-[13px] text-muted mt-0.5">Gestión centralizada de llantas</p>
          </div>
        </div>
        <div className="mt-3">
          <Link
            href="/admin/neumaticos/modelos"
            className="text-[13px] font-medium text-accent hover:text-accent/80 transition-colors"
          >
            Modelos
          </Link>
        </div>
      </header>

      <main className="px-8 pb-12">
        <InventarioAdminTable modelos={modelos} />
      </main>
    </div>
  );
}
