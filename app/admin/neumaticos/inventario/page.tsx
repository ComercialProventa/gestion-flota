import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import InventarioAdminTable, { type NeumaticoAdmin } from "./inventario-admin-table";
import { obtenerModelosNeumaticos } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Inventario de Neumáticos | Administración",
  description: "DataGrid avanzado de inventario de neumáticos con filtros y trazabilidad",
};

export default async function InventarioAdminPage() {
  const supabase = await createClient();

  const { data: neumaticos, error } = await supabase
    .from("neumaticos")
    .select(`
      id,
      codigo_unico,
      numero_serie,
      codigo_dot,
      ciclo_vida,
      estado,
      posicion_actual,
      desgaste_acumulado_km,
      factura_numero,
      proveedor,
      precio,
      creado_en,
      modelos_neumaticos ( marca, medida ),
      usuarios ( nombre_completo ),
      buses ( patente )
    `)
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("SUPABASE ERROR IN ADMIN INVENTARIO:", error);
  }

  const lista = (neumaticos as unknown as NeumaticoAdmin[]) || [];

  const counts = {
    inventario: lista.filter((n) => n.estado === "inventario").length,
    instalado: lista.filter((n) => n.estado === "instalado").length,
    reciclaje: lista.filter((n) => n.estado === "reciclaje").length,
  };

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
              <p className="text-xs text-slate-400">{lista.length} neumáticos en total</p>
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
        {lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-600/10 text-amber-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Sin neumáticos registrados</h3>
            <p className="text-sm text-slate-400">Los neumáticos aparecerán aquí cuando se registren desde el taller.</p>
          </div>
        ) : (
          <InventarioAdminTable neumaticos={lista} counts={counts} modelos={modelos} />
        )}
      </main>
    </div>
  );
}
