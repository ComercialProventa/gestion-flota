import type { Metadata } from "next";
import CombustibleDashboard from "./combustible-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Antirrobo de Combustible | Inteligencia",
  description: "Tendencias de rendimiento, comparativa gemelas y alertas de estanque fantasma",
};

export default function CombustiblePage() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">Antirrobo de Combustible</h1>
        <p className="text-[13px] text-muted mt-0.5">Rendimiento Km/L · Gemelas · Estanque Fantasma</p>
      </header>

      <main className="px-8 pb-12">
        <CombustibleDashboard />
      </main>
    </div>
  );
}
