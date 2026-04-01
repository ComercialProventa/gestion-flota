import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Centro de Inteligencia | Gestión de Flota",
  description: "Módulos de auditoría, antirrobo y análisis de eficiencia",
};

const MODULOS = [
  {
    href: "/admin/inteligencia/combustible",
    titulo: "Antirrobo de Combustible",
    descripcion: "Tendencias de rendimiento Km/L, comparativa de unidades gemelas y alertas de estanque fantasma",
    accentColor: "text-amber-400",
    badges: ["Tendencia Km/L", "Gemelas", "Estanque Fantasma"],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
  {
    href: "/admin/inteligencia/neumaticos",
    titulo: "Auditoría de Neumáticos",
    descripcion: "Ranking de rentabilidad CPK (Costo por Km) y detección de cambiazo prematuro",
    accentColor: "text-emerald-400",
    badges: ["Ranking CPK", "Alerta Cambiazo"],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    href: "/admin/inteligencia/mantenimiento",
    titulo: "Mantenimiento y Repuestos",
    descripcion: "Frecuencia de cambios, detección de anomalías y gasto mensual por unidad",
    accentColor: "text-sky-400",
    badges: ["Anomalías", "Gasto Mensual"],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.388-2.572a1.125 1.125 0 01-.052-1.965l7.56-4.365a1.125 1.125 0 011.123 0l7.56 4.365a1.125 1.125 0 01-.052 1.965l-5.388 2.572a1.125 1.125 0 01-1.072 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9m9 9a9 9 0 009-9m-9 9V3m0 0L7.5 7.5M12 3l4.5 4.5" />
      </svg>
    ),
  },
];

export default function InteligenciaHub() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-border-default pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">Centro de Inteligencia</h1>
          <p className="text-sm text-zinc-400">Auditoría, antirrobo y análisis de eficiencia</p>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-5xl mt-2">
        {/* Banner de contexto */}
        <div className="mb-6 rounded-xl border border-border-default bg-surface-card p-5">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Estos módulos cruzan automáticamente los datos operacionales para detectar{" "}
            <span className="text-amber-400 font-semibold">robos de combustible</span>,{" "}
            <span className="text-emerald-400 font-semibold">fraudes en neumáticos</span> y{" "}
            <span className="text-sky-400 font-semibold">anomalías en mantenimiento</span>.
            Las alertas se generan en tiempo real con cada registro.
          </p>
        </div>

        {/* Cards de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODULOS.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group relative rounded-xl border border-border-default bg-surface-card p-5 transition-all hover:border-border-strong hover:bg-surface-raised"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/8 ${mod.accentColor}`}>
                {mod.icon}
              </div>
              <h2 className="text-[15px] font-bold text-foreground mb-1.5">{mod.titulo}</h2>
              <p className="text-[12px] text-zinc-400 leading-relaxed mb-4">{mod.descripcion}</p>
              <div className="flex flex-wrap gap-1.5">
                {mod.badges.map((b) => (
                  <span key={b} className="rounded-full bg-surface-overlay px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-border-subtle">
                    {b}
                  </span>
                ))}
              </div>
              <div className="absolute top-5 right-5 text-zinc-600 group-hover:text-accent transition-all group-hover:translate-x-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Resumen diario */}
        <div className="mt-6 rounded-xl border border-border-default bg-surface-card p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-overlay text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Resumen Diario a Gerencia</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Envío automático configurable vía Cron Job a <code className="text-accent bg-accent/10 px-1 py-0.5 rounded text-[11px] font-mono">/api/resumen-diario</code>
              </p>
            </div>
          </div>
          <span className="rounded-full bg-success/10 px-3 py-1 text-[10px] font-bold text-success flex items-center gap-1.5 uppercase tracking-wider border border-success/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            API Activa
          </span>
        </div>
      </main>
    </div>
  );
}
