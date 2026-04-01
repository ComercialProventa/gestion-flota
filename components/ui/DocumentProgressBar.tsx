"use client";

import { calcularVigencia, type EstadoVigencia } from "@/utils/fechas";

/**
 * Colores de la barra según estado.
 */
const BAR_COLORS: Record<EstadoVigencia, string> = {
  verde: "bg-emerald-500",
  amarillo: "bg-amber-400",
  rojo: "bg-red-500 animate-pulse",
};

const TEXT_COLORS: Record<EstadoVigencia, string> = {
  verde: "text-emerald-400",
  amarillo: "text-amber-400",
  rojo: "text-red-400",
};

/**
 * DocumentProgressBar — Barra de progreso lineal para documentos legales.
 *
 * Muestra el nombre del documento, los días restantes y una barra
 * de progreso con colores según el estado de vigencia.
 *
 * Props:
 * - nombre: Nombre del documento (ej: "Revisión Técnica")
 * - fechaVencimiento: Fecha en formato string (YYYY-MM-DD) o null
 */
export default function DocumentProgressBar({
  nombre,
  fechaVencimiento,
}: {
  nombre: string;
  fechaVencimiento: string | null;
}) {
  const info = calcularVigencia(fechaVencimiento);

  // Sin fecha configurada
  if (!info) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">{nombre}</span>
          <span className="text-xs text-zinc-600">Sin fecha</span>
        </div>
        <div className="w-full rounded-full bg-surface-overlay h-2">
          <div className="h-2 rounded-full bg-zinc-700" style={{ width: "0%" }} />
        </div>
      </div>
    );
  }

  const { diasRestantes, porcentajeRestante, estadoColor } = info;

  // Texto descriptivo
  let textoEstado: string;
  if (diasRestantes < 0) {
    textoEstado = `Vencido hace ${Math.abs(diasRestantes)} día${Math.abs(diasRestantes) !== 1 ? "s" : ""}`;
  } else if (diasRestantes === 0) {
    textoEstado = "Vence hoy";
  } else {
    textoEstado = `Vence en ${diasRestantes} día${diasRestantes !== 1 ? "s" : ""}`;
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{nombre}</span>
        <span className={`text-xs font-semibold ${TEXT_COLORS[estadoColor]}`}>
          {textoEstado}
        </span>
      </div>
      <div className="w-full rounded-full bg-surface-overlay h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${BAR_COLORS[estadoColor]}`}
          style={{ width: `${porcentajeRestante}%` }}
        />
      </div>
    </div>
  );
}
