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
    color: "amber",
    badges: ["Tendencia Km/L", "Gemelas", "Estanque Fantasma"],
  },
  {
    href: "/admin/inteligencia/neumaticos",
    titulo: "Auditoría de Neumáticos",
    descripcion: "Ranking de rentabilidad CPK (Costo por Km) y detección de cambiazo prematuro",
    color: "emerald",
    badges: ["Ranking CPK", "Alerta Cambiazo"],
  },
  {
    href: "/admin/inteligencia/mantenimiento",
    titulo: "Mantenimiento y Repuestos",
    descripcion: "Frecuencia de cambios, detección de anomalías y gasto mensual por unidad",
    color: "sky",
    badges: ["Anomalías", "Gasto Mensual"],
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string; }> = {
  amber: {
    bg: "bg-[#121214]",
    border: "border-white/5",
    text: "text-slate-300",
    badge: "bg-white/5 text-slate-400",
  },
  emerald: {
    bg: "bg-[#121214]",
    border: "border-white/5",
    text: "text-slate-300",
    badge: "bg-white/5 text-slate-400",
  },
  sky: {
    bg: "bg-[#121214]",
    border: "border-white/5",
    text: "text-slate-300",
    badge: "bg-white/5 text-slate-400",
  },
};

export default function InteligenciaHub() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Centro de Inteligencia</h1>
          <p className="text-sm text-slate-400">Auditoría, antirrobo y análisis de eficiencia</p>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-5xl mt-6">
        {/* Banner de contexto */}
        <div className="mb-6 rounded border border-white/5 bg-[#121214] p-5">
          <p className="text-sm text-slate-300 leading-relaxed">
            Estos módulos cruzan automáticamente los datos operacionales para detectar{" "}
            <span className="text-amber-400 font-semibold">robos de combustible</span>,{" "}
            <span className="text-emerald-400 font-semibold">fraudes en neumáticos</span> y{" "}
            <span className="text-sky-400 font-semibold">anomalías en mantenimiento</span>.
            Las alertas se generan en tiempo real con cada registro.
          </p>
        </div>

        {/* Cards de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MODULOS.map((mod) => {
            const c = COLOR_MAP[mod.color];
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className={`group relative rounded border border-white/5 bg-[#121214] p-5 transition-colors hover:bg-white/[0.02]`}
              >
                <h2 className={`text-[13px] font-bold text-white mb-1.5`}>{mod.titulo}</h2>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{mod.descripcion}</p>
                <div className="flex flex-wrap gap-1.5">
                  {mod.badges.map((b) => (
                    <span key={b} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${c.badge}`}>
                      {b}
                    </span>
                  ))}
                </div>
                {/* Arrow */}
                <div className={`absolute top-5 right-5 ${c.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Resumen diario */}
        <div className="mt-6 rounded border border-white/5 bg-[#121214] p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-white/5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-purple-300">Resumen Diario a Gerencia</h3>
              <p className="text-xs text-slate-400 mt-1">
                Envío automático configurable vía Cron Job a <code className="text-purple-300 bg-purple-900/50 px-1 py-0.5 rounded">/api/resumen-diario</code>
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            API Activa
          </span>
        </div>
      </main>
    </div>
  );
}
