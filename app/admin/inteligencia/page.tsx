import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centro de Inteligencia | Gestión de Flota",
  description: "Módulos de auditoría, antirrobo y análisis de eficiencia",
};

const MODULOS = [
  {
    href: "/admin/inteligencia/combustible",
    emoji: "⛽",
    titulo: "Antirrobo de Combustible",
    descripcion: "Tendencias de rendimiento Km/L, comparativa de unidades gemelas y alertas de estanque fantasma",
    color: "amber",
    badges: ["Tendencia Km/L", "Gemelas", "Estanque Fantasma"],
  },
  {
    href: "/admin/inteligencia/neumaticos",
    emoji: "🛞",
    titulo: "Auditoría de Neumáticos",
    descripcion: "Ranking de rentabilidad CPK (Costo por Km) y detección de cambiazo prematuro",
    color: "emerald",
    badges: ["Ranking CPK", "Alerta Cambiazo"],
  },
  {
    href: "/admin/inteligencia/mantenimiento",
    emoji: "🔧",
    titulo: "Mantenimiento y Repuestos",
    descripcion: "Frecuencia de cambios, detección de anomalías y gasto mensual por unidad",
    color: "sky",
    badges: ["Anomalías", "Gasto Mensual"],
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string; glow: string }> = {
  amber: {
    bg: "bg-amber-600/10",
    border: "border-amber-500/20 hover:border-amber-500/40",
    text: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-400/80",
    glow: "shadow-amber-500/10",
  },
  emerald: {
    bg: "bg-emerald-600/10",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    text: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-400/80",
    glow: "shadow-emerald-500/10",
  },
  sky: {
    bg: "bg-sky-600/10",
    border: "border-sky-500/20 hover:border-sky-500/40",
    text: "text-sky-400",
    badge: "bg-sky-500/15 text-sky-400/80",
    glow: "shadow-sky-500/10",
  },
};

export default function InteligenciaHub() {
  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <a href="/admin" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </a>
            <div>
              <h1 className="text-lg font-semibold text-white">🧠 Centro de Inteligencia</h1>
              <p className="text-xs text-slate-400">Auditoría, antirrobo y análisis de eficiencia</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Banner de contexto */}
        <div className="mb-8 rounded-2xl border border-slate-700/30 bg-gradient-to-r from-slate-800/80 to-slate-800/40 p-6">
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
              <a
                key={mod.href}
                href={mod.href}
                className={`group relative rounded-2xl border ${c.border} bg-slate-800/60 p-6 transition-all duration-300 hover:shadow-xl ${c.glow} hover:-translate-y-0.5`}
              >
                <div className="text-3xl mb-3">{mod.emoji}</div>
                <h2 className={`text-base font-bold ${c.text} mb-2`}>{mod.titulo}</h2>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{mod.descripcion}</p>
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
              </a>
            );
          })}
        </div>

        {/* Resumen diario */}
        <div className="mt-8 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 flex items-center gap-4">
          <div className="text-2xl">📧</div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-purple-300">Resumen Diario por Correo</h3>
            <p className="text-xs text-slate-400">A las 23:59, el administrador recibirá un correo con cargas del día, alertas y vigencias</p>
          </div>
          <span className="rounded-full bg-purple-500/15 px-3 py-1 text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Próximamente</span>
        </div>
      </main>
    </div>
  );
}
