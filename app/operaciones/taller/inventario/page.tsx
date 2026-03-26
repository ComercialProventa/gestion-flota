import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import InventarioForm from "./inventario-form";
import StockTallerList, { NeumaticoStock } from "./stock-taller-list";
import OperacionesShell from "../../operaciones-shell";

export const metadata: Metadata = {
  title: "Bodega | Taller",
  description: "Registro de neumáticos nuevos al inventario del taller",
};

export default async function InventarioPage() {
  const supabase = await createClient();

  const { data: stock } = await supabase
    .from("neumaticos")
    .select(`
      id, codigo_unico, numero_serie, codigo_dot, ciclo_vida, creado_en,
      modelos_neumaticos ( marca, medida ), usuarios ( nombre_completo )
    `)
    .eq("estado", "inventario")
    .order("creado_en", { ascending: false });

  return (
    // Quitamos los títulos largos del Shell si es posible, o usamos uno corto
    <OperacionesShell title="BODEGA TALLER" backHref="/operaciones">
      <div className="flex flex-col w-full space-y-3 pb-4 animate-in fade-in duration-300">

        {/* ─── BOTÓN DE STOCK (Te sugiero ir a stock-taller-list y cambiarle el h-28 por h-14) ─── */}
        <StockTallerList stock={(stock as unknown as NeumaticoStock[]) || []} />

        {/* ─── ÁREA DE INGRESO ULTRA COMPACTA ─── */}
        <section className="flex flex-col w-full">
          {/* Título minimalista sin cajas inmensas */}
          <div className="border-l-4 border-emerald-500 pl-3 mb-3">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter leading-none">
              NUEVO INGRESO
            </h2>
          </div>

          <div className="w-full">
            <InventarioForm />
          </div>
        </section>

      </div>
    </OperacionesShell>
  );
}