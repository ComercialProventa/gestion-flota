import type { Metadata } from "next";
import MantenimientoForm from "./mantenimiento-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mantenimiento | Operaciones",
  description: "Registro de repuestos y mantenimiento",
};

export default function MantenimientoPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center px-4 py-3 gap-3">
          <a href="/operaciones" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </a>
          <h1 className="text-lg font-semibold text-white">Registro de Mantenimiento</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600/20 text-sky-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M15.17 11.42L21 5.58A2.652 2.652 0 0017.25 1.83l-5.83 5.83" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11l-3 3-5-5-3 3a1.414 1.414 0 002 2l3-3 5 5 3-3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Ingresar Repuesto o Servicio</h2>
              <p className="text-xs text-slate-400">Todo registro alimenta las métricas del administrador</p>
            </div>
          </div>
          <MantenimientoForm />
        </div>
      </main>
    </div>
  );
}
