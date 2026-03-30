import type { Metadata } from "next";
import InventarioForm from "./inventario-form";
import StockTallerList from "./stock-taller-list";
import OperacionesShell from "../../operaciones-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bodega | Taller",
  description: "Registro de neumáticos nuevos al inventario del taller",
};

export default function InventarioPage() {
  return (
    <OperacionesShell title="BODEGA TALLER" backHref="/operaciones">
      <div className="flex flex-col w-full space-y-3 pb-4 animate-in fade-in duration-300">
        <StockTallerList />

        <section className="flex flex-col w-full">
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
