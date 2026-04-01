"use client";

import { calcularVigencia, type EstadoVigencia } from "@/utils/fechas";

const BAR_COLORS: Record<EstadoVigencia, string> = {
  verde: "bg-green",
  amarillo: "bg-accent",
  rojo: "bg-red animate-pulse",
};

const TEXT_COLORS: Record<EstadoVigencia, string> = {
  verde: "text-green",
  amarillo: "text-accent",
  rojo: "text-red",
};

export default function DocumentProgressBar({
  nombre,
  fechaVencimiento,
}: {
  nombre: string;
  fechaVencimiento: string | null;
}) {
  const info = calcularVigencia(fechaVencimiento);

  if (!info) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-foreground">{nombre}</span>
          <span className="text-[12px] text-dim">Sin fecha</span>
        </div>
        <div className="w-full h-1 bg-surface rounded-full" />
      </div>
    );
  }

  const { diasRestantes, porcentajeRestante, estadoColor } = info;

  let textoEstado: string;
  if (diasRestantes < 0) {
    textoEstado = `Vencido hace ${Math.abs(diasRestantes)}d`;
  } else if (diasRestantes === 0) {
    textoEstado = "Vence hoy";
  } else {
    textoEstado = `${diasRestantes}d`;
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] text-foreground">{nombre}</span>
        <span className={`text-[12px] font-medium ${TEXT_COLORS[estadoColor]}`}>
          {textoEstado}
        </span>
      </div>
      <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
        <div
          className={`h-1 rounded-full transition-all duration-500 ${BAR_COLORS[estadoColor]}`}
          style={{ width: `${porcentajeRestante}%` }}
        />
      </div>
    </div>
  );
}
