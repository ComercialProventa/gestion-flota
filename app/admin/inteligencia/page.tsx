import type { Metadata } from "next";
import IntelTabs from "@/components/inteligencia/intel-tabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Centro de Inteligencia | Gestión de Flota",
  description: "Auditoría y análisis de eficiencia operacional",
};

export default function InteligenciaPage() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">Centro de Inteligencia</h1>
        <p className="text-[13px] text-muted mt-0.5">Auditoría y análisis de eficiencia operacional</p>
      </header>

      <main className="px-8 pb-12">
        <IntelTabs />
      </main>
    </div>
  );
}
