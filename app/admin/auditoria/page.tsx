import type { Metadata } from "next";
import AuditoriaCliente from "./auditoria-cliente";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bitácora de Auditoría",
  description: "Registro detallado de cambios y trazabilidad del sistema",
};

export default function AuditoriaPage() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-border-default pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">Bitácora de Auditoría</h1>
          <p className="text-sm text-zinc-400">Trazabilidad en tiempo real de los cambios del sistema</p>
        </div>
      </header>
      <main className="flex-1 w-full mt-2">
        <AuditoriaCliente />
      </main>
    </div>
  );
}
