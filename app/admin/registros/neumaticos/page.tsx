import type { Metadata } from "next";
import RegistrosNeumaticosCliente from "./neumaticos-cliente";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Historial de Neumáticos | Correcciones",
  description: "Edición y seguimiento de movimientos de neumáticos",
};

export default function RegistrosNeumaticosPage() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Historial de Neumáticos</h1>
          <p className="text-sm text-slate-400">Registro completo de movimientos del sistema</p>
        </div>
      </header>
      <main className="flex-1 w-full mx-auto max-w-6xl mt-6">
        <RegistrosNeumaticosCliente />
      </main>
    </div>
  );
}
