import type { Metadata } from "next";
import NeumaticosDashboard from "./neumaticos-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Auditoría de Neumáticos | Inteligencia",
  description: "Ranking de rentabilidad real (CPK) y auditoría de desgaste",
};

export default function NeumaticosPage() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">Auditoría de Neumáticos</h1>
        <p className="text-[13px] text-muted mt-0.5">Rentabilidad CPK y Alertas Antirrobo</p>
      </header>

      <main className="px-8 pb-12">
        <NeumaticosDashboard />
      </main>
    </div>
  );
}
