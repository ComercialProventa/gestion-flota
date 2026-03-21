"use client";

/**
 * ChasisPreview — Vista aérea esquemática de un vehículo.
 *
 * Nomenclatura por ejes:
 * - '2_ejes_6_ruedas':  1 eje direccional (2 ruedas) + 1 eje motriz doble (4 ruedas) = 6 total
 * - '3_ejes_10_ruedas': 1 eje direccional (2 ruedas) + 2 ejes traseros dobles (4+4)  = 10 total
 *
 * Retro-compatible: acepta los tipos antiguos 'estandar_6' y 'doble_piso_10'.
 */

export type ChasisTipo = "2_ejes_6_ruedas" | "3_ejes_10_ruedas" | "estandar_6" | "doble_piso_10";

/** Normaliza tipos antiguos a nomenclatura de ejes */
function normalizarTipo(tipo: string): "2_ejes_6_ruedas" | "3_ejes_10_ruedas" {
  if (tipo === "doble_piso_10" || tipo === "3_ejes_10_ruedas") return "3_ejes_10_ruedas";
  return "2_ejes_6_ruedas";
}

export const EJES_LABEL: Record<string, string> = {
  "2_ejes_6_ruedas": "2 Ejes · 6 Ruedas",
  "3_ejes_10_ruedas": "3 Ejes · 10 Ruedas",
  estandar_6: "2 Ejes · 6 Ruedas",
  doble_piso_10: "3 Ejes · 10 Ruedas",
};

function RuedaSencilla({ compact }: { compact?: boolean }) {
  const size = compact ? "h-3 w-6" : "h-4 w-8";
  return (
    <div className={`${size} rounded-sm bg-slate-300 border border-slate-400 shadow-inner`} />
  );
}

function RuedaDoble({ compact }: { compact?: boolean }) {
  const size = compact ? "h-3 w-6" : "h-4 w-8";
  const gap = compact ? "gap-0.5" : "gap-1";
  return (
    <div className={`flex flex-col ${gap}`}>
      <div className={`${size} rounded-sm bg-slate-300 border border-slate-400 shadow-inner`} />
      <div className={`${size} rounded-sm bg-slate-300 border border-slate-400 shadow-inner`} />
    </div>
  );
}

export default function ChasisPreview({
  tipo,
  compact = false,
}: {
  tipo: ChasisTipo;
  compact?: boolean;
}) {
  const tipoNorm = normalizarTipo(tipo);
  const bodyH = compact ? "h-12" : "h-20";
  const bodyGap = compact ? "gap-1" : "gap-2";
  const axleGap = compact ? "gap-0.5" : "gap-1";
  const sectionGap = compact ? "gap-3" : "gap-5";
  const bodyRound = compact ? "rounded-lg" : "rounded-xl";
  const labelSize = compact ? "text-[7px]" : "text-[9px]";

  return (
    <div className={`flex items-center ${sectionGap} select-none`}>
      {/* Eje direccional (frente) */}
      <div className="flex flex-col items-center">
        <span className={`${labelSize} uppercase tracking-wider text-slate-500 mb-1 font-semibold`}>
          Dir.
        </span>
        <div className={`flex flex-col ${axleGap}`}>
          <RuedaSencilla compact={compact} />
          <div className={`${bodyH} ${compact ? "w-6" : "w-8"} ${bodyRound} bg-gradient-to-b from-sky-600/30 to-sky-700/30 border border-sky-500/30`} />
          <RuedaSencilla compact={compact} />
        </div>
      </div>

      {/* Cuerpo */}
      <div className={`flex-1 flex flex-col items-center justify-center ${bodyGap}`}>
        <div className={`w-full ${bodyH} ${bodyRound} bg-gradient-to-r from-sky-700/20 via-sky-600/15 to-sky-700/20 border border-dashed border-sky-500/20 flex items-center justify-center`}>
          <span className={`${labelSize} text-sky-400/50 uppercase tracking-widest font-bold`}>
            {EJES_LABEL[tipoNorm]}
          </span>
        </div>
      </div>

      {/* Eje motriz 1 */}
      <div className="flex flex-col items-center">
        <span className={`${labelSize} uppercase tracking-wider text-slate-500 mb-1 font-semibold`}>
          {tipoNorm === "3_ejes_10_ruedas" ? "M1" : "Motriz"}
        </span>
        <div className={`flex flex-col ${axleGap}`}>
          <RuedaDoble compact={compact} />
          <div className={`${bodyH} ${compact ? "w-6" : "w-8"} ${bodyRound} bg-gradient-to-b from-amber-600/30 to-amber-700/30 border border-amber-500/30`} />
          <RuedaDoble compact={compact} />
        </div>
      </div>

      {/* Eje motriz 2 (solo 3 ejes) */}
      {tipoNorm === "3_ejes_10_ruedas" && (
        <div className="flex flex-col items-center">
          <span className={`${labelSize} uppercase tracking-wider text-slate-500 mb-1 font-semibold`}>
            M2
          </span>
          <div className={`flex flex-col ${axleGap}`}>
            <RuedaDoble compact={compact} />
            <div className={`${bodyH} ${compact ? "w-6" : "w-8"} ${bodyRound} bg-gradient-to-b from-amber-600/30 to-amber-700/30 border border-amber-500/30`} />
            <RuedaDoble compact={compact} />
          </div>
        </div>
      )}
    </div>
  );
}
