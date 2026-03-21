import type { Metadata } from "next";
import {
  obtenerRendimientoFlota,
  obtenerComparativaGemelas,
  obtenerAlertasEstanque,
} from "./actions";
import CombustibleDashboard from "./combustible-dashboard";

export const metadata: Metadata = {
  title: "Antirrobo de Combustible | Inteligencia",
  description: "Tendencias de rendimiento, comparativa gemelas y alertas de estanque fantasma",
};

export default async function CombustiblePage() {
  const [rendimiento, gemelas, alertas] = await Promise.all([
    obtenerRendimientoFlota(),
    obtenerComparativaGemelas(),
    obtenerAlertasEstanque(),
  ]);

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <a href="/admin/inteligencia" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </a>
            <div>
              <h1 className="text-lg font-semibold text-white">⛽ Antirrobo de Combustible</h1>
              <p className="text-xs text-slate-400">Rendimiento Km/L · Gemelas · Estanque Fantasma</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <CombustibleDashboard
          rendimiento={rendimiento}
          gemelas={gemelas}
          alertas={alertas}
        />
      </main>
    </div>
  );
}
