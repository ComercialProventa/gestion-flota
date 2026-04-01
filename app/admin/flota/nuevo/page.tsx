import type { Metadata } from "next";
import Link from "next/link";
import NuevaUnidadForm from "./nueva-unidad-form";

export const metadata: Metadata = {
  title: "Nueva Unidad | Maestro de Flota",
};

export default function NuevaUnidadPage() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 px-8 pt-10 pb-6">
        <Link href="/admin/flota" className="text-dim hover:text-foreground transition-colors text-[13px]">← Volver</Link>
        <h1 className="text-[22px] font-bold text-foreground tracking-tight">Nueva Unidad</h1>
      </div>
      <div className="px-8 pb-12">
        <NuevaUnidadForm />
      </div>
    </div>
  );
}
