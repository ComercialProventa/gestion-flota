import type { Metadata } from "next";
import {
  obtenerRankingCPK,
  obtenerAlertasCambiazo,
} from "./actions";
import NeumaticosDashboard from "./neumaticos-dashboard";

export const metadata: Metadata = {
  title: "Auditoría de Neumáticos | Inteligencia",
  description: "Ranking de rentabilidad real (CPK) y auditoría de desgaste",
};

export default async function NeumaticosPage() {
  const [ranking, alertas] = await Promise.all([
    obtenerRankingCPK(),
    obtenerAlertasCambiazo(),
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
              <h1 className="text-lg font-semibold text-white">🛞 Auditoría de Neumáticos</h1>
              <p className="text-xs text-slate-400">Rentabilidad CPK y Alertas Antirrobo</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <NeumaticosDashboard ranking={ranking} alertas={alertas} />
      </main>
    </div>
  );
}
