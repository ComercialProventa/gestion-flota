import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Correcciones Operativas",
  description: "Gestión y edición manual de registros operativos del sistema",
};

export default function RegistrosOperativosDashboard() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">Correcciones Operativas</h1>
        <p className="text-[13px] text-muted mt-0.5">Edición manual y rectificación de historiales</p>
      </header>

      <main className="px-8 pb-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/admin/registros/combustible"
            className="group"
          >
            <h3 className="text-[15px] font-semibold text-foreground">Cargas de Combustible</h3>
            <p className="mt-1 text-[12px] text-muted">Corrige litros o kilometrajes mal ingresados</p>
          </Link>

          <Link
            href="/admin/registros/neumaticos"
            className="group"
          >
            <h3 className="text-[15px] font-semibold text-foreground">Movimientos Neumáticos</h3>
            <p className="mt-1 text-[12px] text-muted">Corrige profundidad de estría, odómetros o motivos</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
