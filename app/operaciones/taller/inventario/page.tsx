import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import InventarioForm from "./inventario-form";
import StockTallerList, { NeumaticoStock } from "./stock-taller-list";
import OperacionesShell from "../../operaciones-shell";

export const metadata: Metadata = {
  title: "Ingreso al Inventario | Taller",
  description: "Registro de neumáticos nuevos al inventario del taller",
};

export default async function InventarioPage() {
  const supabase = await createClient();

  const { data: stock } = await supabase
    .from("neumaticos")
    .select(`
      id,
      codigo_unico,
      numero_serie,
      codigo_dot,
      ciclo_vida,
      creado_en,
      modelos_neumaticos ( marca, medida ),
      usuarios ( nombre_completo )
    `)
    .eq("estado", "inventario")
    .order("creado_en", { ascending: false });

  return (
    <OperacionesShell title="Gestión de Bodega" backHref="/operaciones">
      <div className="mx-auto max-w-md space-y-4">
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 flex-1 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-white leading-tight">Nuevo Ingreso</h2>
                <p className="text-[11px] text-white/40 leading-tight">Entrada a bodega</p>
              </div>
            </div>
            
            {/* Botón sutil de Bodega */}
            <StockTallerList stock={(stock as unknown as NeumaticoStock[]) || []} />
          </div>
          
          <InventarioForm />
        </section>
      </div>
    </OperacionesShell>
  );
}
