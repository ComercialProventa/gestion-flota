import type { Metadata } from "next";
import CombustibleDashboard from "./combustible-dashboard";

export const metadata: Metadata = {
  title: "Antirrobo de Combustible | Inteligencia",
  description: "Tendencias de rendimiento, comparativa gemelas y alertas de estanque fantasma",
};

export default function CombustiblePage() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Antirrobo de Combustible</h1>
          <p className="text-sm text-slate-400">Rendimiento Km/L · Gemelas · Estanque Fantasma</p>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-6xl mt-6">
        <CombustibleDashboard />
      </main>
    </div>
  );
}
