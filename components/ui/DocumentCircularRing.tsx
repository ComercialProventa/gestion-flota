"use client";

import { calcularVigencia, type EstadoVigencia } from "@/utils/fechas";

/**
 * Colores del stroke del anillo según estado.
 */
const STROKE_COLORS: Record<EstadoVigencia, string> = {
  verde: "#10b981",   // emerald-500
  amarillo: "#fbbf24", // amber-400
  rojo: "#ef4444",     // red-500
};

const TEXT_COLORS: Record<EstadoVigencia, string> = {
  verde: "text-emerald-400",
  amarillo: "text-amber-400",
  rojo: "text-red-400",
};

const BG_COLORS: Record<EstadoVigencia, string> = {
  verde: "bg-emerald-500/10 border-emerald-500/20",
  amarillo: "bg-amber-500/10 border-amber-500/20",
  rojo: "bg-red-500/10 border-red-500/20",
};

/**
 * DocumentCircularRing — Anillo circular SVG (donut chart) para documentos.
 *
 * Muestra un círculo progresivo con los días restantes en el centro.
 * El stroke se colorea según el estado de vigencia.
 *
 * Props:
 * - nombre: Nombre del documento
 * - fechaVencimiento: Fecha string o null
 * - size: Tamaño del SVG en px (default: 120)
 */
export default function DocumentCircularRing({
  nombre,
  fechaVencimiento,
  size = 120,
}: {
  nombre: string;
  fechaVencimiento: string | null;
  size?: number;
}) {
  const info = calcularVigencia(fechaVencimiento);

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Sin fecha configurada
  if (!info) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgb(51 65 85 / 0.4)"
              strokeWidth={strokeWidth}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-slate-600">—</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-600">N/A</span>
          </div>
        </div>
        <span className="text-xs font-medium text-slate-500">{nombre}</span>
      </div>
    );
  }

  const { diasRestantes, porcentajeRestante, estadoColor } = info;
  const dashOffset = circumference - (porcentajeRestante / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-2 rounded-2xl border p-4 ${BG_COLORS[estadoColor]} ${estadoColor === "rojo" ? "animate-pulse" : ""}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Fondo del ring */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgb(51 65 85 / 0.3)"
            strokeWidth={strokeWidth}
          />
          {/* Progreso */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={STROKE_COLORS[estadoColor]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Texto central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${TEXT_COLORS[estadoColor]}`}>
            {diasRestantes < 0 ? Math.abs(diasRestantes) : diasRestantes}
          </span>
          <span className={`text-[9px] uppercase tracking-wider ${TEXT_COLORS[estadoColor]} opacity-70`}>
            {diasRestantes < 0 ? "Vencido" : "Días"}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-slate-300">{nombre}</span>
      {fechaVencimiento && (
        <span className="text-[10px] text-slate-500">
          {new Date(fechaVencimiento).toLocaleDateString("es-CL")}
        </span>
      )}
    </div>
  );
}
