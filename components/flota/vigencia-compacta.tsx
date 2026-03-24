"use client";

import { calcularVigencia, type EstadoVigencia } from "@/utils/fechas";

const BADGE_STYLES: Record<EstadoVigencia, string> = {
  verde: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  amarillo: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  rojo: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
};

const BAR_COLORS: Record<EstadoVigencia, string> = {
  verde: "bg-emerald-500",
  amarillo: "bg-amber-400",
  rojo: "bg-red-500 animate-pulse",
};

const BADGE_TEXT: Record<EstadoVigencia, string> = {
  verde: "Vigente",
  amarillo: "Por vencer",
  rojo: "Crítico",
};

/**
 * VigenciaCompacta — Componente ultra-compacto de vigencia legal.
 *
 * Diseño: Badge pill con estado + barra ultra-fina h-1.5.
 * Ocupa mínimo espacio vertical, ideal para tablas y listas densas.
 *
 * Props:
 * - nombreDocumento: "Revisión Técnica" or "Seguro"
 * - fechaVencimiento: fecha string or null
 * - onRenovar: callback opcional para acción rápida de renovación
 */
export default function VigenciaCompacta({
  nombreDocumento,
  fechaVencimiento,
  onRenovar,
}: {
  nombreDocumento: string;
  fechaVencimiento: string | null;
  onRenovar?: () => void;
}) {
  const info = calcularVigencia(fechaVencimiento);

  if (!info) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">{nombreDocumento}</span>
          <span className="rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
            Sin fecha
          </span>
        </div>
        <div className="w-full rounded-full bg-slate-700/40 h-1.5">
          <div className="h-1.5 rounded-full bg-slate-700" style={{ width: "0%" }} />
        </div>
      </div>
    );
  }

  const { diasRestantes, porcentajeRestante, estadoColor } = info;

  let textoCorto: string;
  if (diasRestantes < 0) {
    textoCorto = `Vencido (${Math.abs(diasRestantes)}d)`;
  } else if (diasRestantes === 0) {
    textoCorto = "Vence hoy";
  } else {
    textoCorto = `${diasRestantes}d`;
  }

  const mostrarRenovar = onRenovar && (estadoColor === "amarillo" || estadoColor === "rojo");

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-slate-400 flex-shrink-0">{nombreDocumento}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold leading-none ${BADGE_STYLES[estadoColor]}`}>
          {BADGE_TEXT[estadoColor]} · {textoCorto}
        </span>
        {mostrarRenovar && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRenovar(); }}
            className="ml-auto rounded-md bg-sky-600/20 p-1 text-sky-400 hover:bg-sky-600/30 transition-colors cursor-pointer flex-shrink-0"
            title={`Renovar ${nombreDocumento}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </button>
        )}
      </div>
      <div className="w-full rounded-full bg-slate-700/40 h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${BAR_COLORS[estadoColor]}`}
          style={{ width: `${porcentajeRestante}%` }}
        />
      </div>
    </div>
  );
}
