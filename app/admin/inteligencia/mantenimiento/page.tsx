import type { Metadata } from "next";
import MantenimientoDashboard from "./mantenimiento-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mantenimiento | Inteligencia",
  description: "Frecuencia de cambios, anomalías y gasto por unidad",
};

export default function InteligenciaMantenimientoPage() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">Mantenimiento y Repuestos</h1>
        <p className="text-[13px] text-muted mt-0.5">Anomalías y Gasto Mensual Vehicular</p>
      </header>

      <main className="px-8 pb-12">
        <MantenimientoDashboard />
      </main>
    </div>
  );
}
