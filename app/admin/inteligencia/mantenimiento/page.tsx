import type { Metadata } from "next";
import MantenimientoDashboard from "./mantenimiento-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mantenimiento | Inteligencia",
  description: "Frecuencia de cambios, anomalías y gasto por unidad",
};

export default function InteligenciaMantenimientoPage() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-border-default pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">Mantenimiento y Repuestos</h1>
          <p className="text-sm text-zinc-400">Anomalías y Gasto Mensual Vehicular</p>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-6xl mt-6">
        <MantenimientoDashboard />
      </main>
    </div>
  );
}
