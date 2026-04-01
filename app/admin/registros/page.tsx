import type { Metadata } from "next";
import RegistrosTabs from "@/components/registros/registros-tabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Correcciones Operativas",
  description: "Edición manual y rectificación de historiales",
};

export default function RegistrosPage() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">Correcciones Operativas</h1>
        <p className="text-[13px] text-muted mt-0.5">Edición manual y rectificación de historiales</p>
      </header>

      <main className="px-8 pb-12">
        <RegistrosTabs />
      </main>
    </div>
  );
}
