import type { Metadata } from "next";
import RegistrosNeumaticosCliente from "./neumaticos-cliente";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Historial de Neumáticos | Correcciones",
  description: "Edición y seguimiento de movimientos de neumáticos",
};

export default function RegistrosNeumaticosPage() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">Historial de Neumáticos</h1>
        <p className="text-[13px] text-muted mt-0.5">Registro completo de movimientos del sistema</p>
      </header>

      <main className="px-8 pb-12">
        <RegistrosNeumaticosCliente />
      </main>
    </div>
  );
}
