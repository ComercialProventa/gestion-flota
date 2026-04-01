import type { Metadata } from "next";
import RegistrosCombustibleCliente from "./registros-cliente";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Historial de Combustible | Correcciones",
  description: "Edición y seguimiento de cargas de combustible",
};

export default function RegistrosCombustiblePage() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">Historial de Combustible</h1>
        <p className="text-[13px] text-muted mt-0.5">Edición manual de registros de carga</p>
      </header>

      <main className="px-8 pb-12">
        <RegistrosCombustibleCliente />
      </main>
    </div>
  );
}
