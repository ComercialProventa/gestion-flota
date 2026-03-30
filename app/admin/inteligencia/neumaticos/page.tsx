import type { Metadata } from "next";
import NeumaticosDashboard from "./neumaticos-dashboard";

export const metadata: Metadata = {
  title: "Auditoría de Neumáticos | Inteligencia",
  description: "Ranking de rentabilidad real (CPK) y auditoría de desgaste",
};

export default function NeumaticosPage() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Auditoría de Neumáticos</h1>
          <p className="text-sm text-slate-400">Rentabilidad CPK y Alertas Antirrobo</p>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-6xl mt-6">
        <NeumaticosDashboard />
      </main>
    </div>
  );
}
