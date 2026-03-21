"use client";

/**
 * ChasisPreview — Vista aérea esquemática de un bus.
 *
 * Dibuja el chasis del bus en horizontal (largo) mostrando:
 * - 'estandar_6':     1 eje delantero (2 ruedas) + 1 eje trasero (4 ruedas dobles) = 6 total
 * - 'doble_piso_10':  1 eje delantero (2 ruedas) + 2 ejes traseros (4+4 dobles)   = 10 total
 *
 * Props:
 * - tipo: tipo de chasis del bus
 * - compact: si es true, renderiza en versión pequeña para listas/cards
 */

type ChasisTipo = "estandar_6" | "doble_piso_10";

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
  const bodyH = compact ? "h-12" : "h-20";
  const bodyGap = compact ? "gap-1" : "gap-2";
  const axleGap = compact ? "gap-0.5" : "gap-1";
  const sectionGap = compact ? "gap-3" : "gap-5";
  const bodyRound = compact ? "rounded-lg" : "rounded-xl";
  const labelSize = compact ? "text-[7px]" : "text-[9px]";

  return (
    <div className={`flex items-center ${sectionGap} select-none`}>
      {/* ─── Frente del bus ─── */}
      <div className="flex flex-col items-center">
        <span className={`${labelSize} uppercase tracking-wider text-slate-500 mb-1 font-semibold`}>
          Frente
        </span>
        {/* Eje delantero: 2 ruedas sencillas */}
        <div className={`flex flex-col ${axleGap}`}>
          <RuedaSencilla compact={compact} />
          <div className={`${bodyH} ${compact ? "w-6" : "w-8"} ${bodyRound} bg-gradient-to-b from-sky-600/30 to-sky-700/30 border border-sky-500/30`} />
          <RuedaSencilla compact={compact} />
        </div>
      </div>

      {/* ─── Cuerpo del bus ─── */}
      <div className={`flex-1 flex flex-col items-center justify-center ${bodyGap}`}>
        <div className={`w-full ${bodyH} ${bodyRound} bg-gradient-to-r from-sky-700/20 via-sky-600/15 to-sky-700/20 border border-dashed border-sky-500/20 flex items-center justify-center`}>
          <span className={`${labelSize} text-sky-400/50 uppercase tracking-widest font-bold`}>
            {tipo === "estandar_6" ? "Bus Estándar" : "Doble Piso"}
          </span>
        </div>
      </div>

      {/* ─── Eje trasero 1 (siempre presente) ─── */}
      <div className="flex flex-col items-center">
        <span className={`${labelSize} uppercase tracking-wider text-slate-500 mb-1 font-semibold`}>
          {tipo === "doble_piso_10" ? "Eje T1" : "Trasera"}
        </span>
        <div className={`flex flex-col ${axleGap}`}>
          <RuedaDoble compact={compact} />
          <div className={`${bodyH} ${compact ? "w-6" : "w-8"} ${bodyRound} bg-gradient-to-b from-amber-600/30 to-amber-700/30 border border-amber-500/30`} />
          <RuedaDoble compact={compact} />
        </div>
      </div>

      {/* ─── Eje trasero 2 (solo doble_piso_10) ─── */}
      {tipo === "doble_piso_10" && (
        <div className="flex flex-col items-center">
          <span className={`${labelSize} uppercase tracking-wider text-slate-500 mb-1 font-semibold`}>
            Eje T2
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
