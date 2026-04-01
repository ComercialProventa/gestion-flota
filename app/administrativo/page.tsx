import type { Metadata } from "next";
import AdministrativoHeader from "@/components/administrativo-header";

export const metadata: Metadata = {
  title: "Panel Administrativo | Gestión de Flota",
  description: "Panel de control del área administrativa",
};

export default function AdministrativoDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <AdministrativoHeader />

      {/* Contenido */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Bienvenido al panel administrativo</h2>
        <p className="text-muted">Los módulos administrativos estarán disponibles próximamente.</p>
      </main>
    </div>
  );
}
