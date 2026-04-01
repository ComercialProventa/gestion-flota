import type { Metadata } from "next";
import CombustibleDashboard from "./combustible-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eficiencia de Combustible | Inteligencia",
  description: "Rendimiento Km/L, comparativa gemelas y análisis de costo por kilómetro",
};

export default function CombustiblePage() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">Eficiencia de Combustible</h1>
        <p className="text-[13px] text-muted mt-0.5">Rendimiento Km/L · Costo por Km · Comparativa Gemelas</p>
      </header>

      <main className="px-8 pb-12">
        <CombustibleDashboard />
      </main>
    </div>
  );
}
