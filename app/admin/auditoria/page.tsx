import type { Metadata } from "next";
import AuditoriaCliente from "./auditoria-cliente";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bitácora de Auditoría",
  description: "Registro detallado de cambios y trazabilidad del sistema",
};

export default function AuditoriaPage() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">Bitácora de Auditoría</h1>
        <p className="text-[13px] text-muted mt-0.5">Trazabilidad en tiempo real de los cambios del sistema</p>
      </header>

      <main className="px-8 pb-12">
        <AuditoriaCliente />
      </main>
    </div>
  );
}
