import type { Metadata } from "next";
import ChasisInteractivo from "./chasis-interactivo";
import OperacionesShell from "../../operaciones-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rotación de Neumáticos | Taller",
  description: "Gestión visual de neumáticos — rotación y baja",
};

export default function RotacionPage() {
  return (
    <OperacionesShell
      title="ROTACIÓN Y EJES"
      subtitle="TALLER MECÁNICO"
      backHref="/operaciones"
    >
      <div className="pb-12 animate-in fade-in duration-300">
        <div className="mb-6 border-b-2 border-white/10 pb-4 flex items-center justify-between">
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-orange-500">
            Control de Rodado
          </h2>
        </div>

        <ChasisInteractivo />
      </div>
    </OperacionesShell>
  );
}
