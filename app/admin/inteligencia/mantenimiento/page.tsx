import type { Metadata } from "next";
import {
  obtenerAnomaliasMantenimiento,
  obtenerGastoMensualPorUnidad,
} from "./actions";
import MantenimientoDashboard from "./mantenimiento-dashboard";

export const metadata: Metadata = {
  title: "Mantenimiento | Inteligencia",
  description: "Frecuencia de cambios, anomalías y gasto por unidad",
};

export default async function InteligenciaMantenimientoPage() {
  const [anomalias, gastos] = await Promise.all([
    obtenerAnomaliasMantenimiento(),
    obtenerGastoMensualPorUnidad(),
  ]);

  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Mantenimiento y Repuestos</h1>
          <p className="text-sm text-slate-400">Anomalías y Gasto Mensual Vehicular</p>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-6xl mt-6">
        <MantenimientoDashboard anomalias={anomalias} gastos={gastos} />
      </main>
    </div>
  );
}
