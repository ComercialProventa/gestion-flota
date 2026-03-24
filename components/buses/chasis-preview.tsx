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

function RuedaSencilla({ compact, isMissing, vertical }: { compact?: boolean; isMissing?: boolean; vertical?: boolean }) {
  const size = compact 
    ? (vertical ? "h-6 w-3" : "h-3 w-6") 
    : (vertical ? "h-8 w-4" : "h-4 w-8");
  const bgClass = isMissing ? "bg-red-500 border-red-700" : "bg-slate-300 border-slate-400";
  return (
    <div className={`${size} rounded-sm ${bgClass} shadow-inner`} />
  );
}

function RuedaDoble({ compact, isMissingTop, isMissingBottom, vertical }: { compact?: boolean; isMissingTop?: boolean; isMissingBottom?: boolean; vertical?: boolean }) {
  const size = compact 
    ? (vertical ? "h-6 w-3" : "h-3 w-6") 
    : (vertical ? "h-8 w-4" : "h-4 w-8");
  const gap = compact ? "gap-0.5" : "gap-1";
  const getBg = (missing?: boolean) => missing ? "bg-red-500 border-red-700" : "bg-slate-300 border-slate-400";
  return (
    <div className={`flex ${vertical ? "flex-row" : "flex-col"} ${gap}`}>
      <div className={`${size} rounded-sm ${getBg(isMissingTop)} shadow-inner`} />
      <div className={`${size} rounded-sm ${getBg(isMissingBottom)} shadow-inner`} />
    </div>
  );
}

export default function ChasisPreview({
  tipo,
  compact = false,
  missingPositions = [],
  vertical = false,
}: {
  tipo: ChasisTipo;
  compact?: boolean;
  missingPositions?: string[];
  vertical?: boolean;
}) {
  const tipoNorm = normalizarTipo(tipo);
  
  // Dimensions vary whether it's vertical or horizontal
  const bodyH = compact ? "h-12" : "h-20";
  const bodyW = compact ? "w-6" : "w-8";
  const axleW = compact ? "w-12" : "w-20";
  const axleH = compact ? "h-6" : "h-8";
  
  const axleInnerClass = vertical 
    ? `${axleW} ${axleH}` 
    : `${bodyW} ${bodyH}`;
    
  const bodyMainClass = vertical 
    ? `h-full ${axleW}` 
    : `w-full ${bodyH}`;

  const bodyGap = compact ? "gap-1" : "gap-2";
  const axleGap = compact ? "gap-0.5" : "gap-1";
  const sectionGap = compact ? "gap-3" : "gap-5";
  const bodyRound = compact ? "rounded-lg" : "rounded-xl";
  const labelSize = compact ? "text-[7px]" : "text-[9px]";

  const mainContainerClass = vertical 
    ? `flex flex-col items-center ${sectionGap} w-full h-full select-none py-2` 
    : `flex items-center ${sectionGap} w-full h-full select-none`;
    
  const axleContainerClass = vertical 
    ? `flex flex-row items-center ${axleGap}` 
    : `flex flex-col items-center ${axleGap}`;

  return (
    <div className={mainContainerClass}>
      {/* Eje direccional (frente) */}
      <div className={`flex ${vertical ? "flex-col" : "flex-col items-center"}`}>
        <span className={`${labelSize} uppercase tracking-wider text-slate-500 font-semibold text-center ${vertical ? "mb-1" : "mb-1"}`}>
          Dir.
        </span>
        <div className={axleContainerClass}>
          {vertical ? (
            <>
              <RuedaSencilla compact={compact} vertical={vertical} isMissing={missingPositions.includes("delantero_izquierdo")} />
              <div className={`${axleInnerClass} ${bodyRound} bg-gradient-to-r from-sky-600/30 to-sky-700/30 border border-sky-500/30`} />
              <RuedaSencilla compact={compact} vertical={vertical} isMissing={missingPositions.includes("delantero_derecho")} />
            </>
          ) : (
            <>
              <RuedaSencilla compact={compact} vertical={vertical} isMissing={missingPositions.includes("delantero_derecho")} />
              <div className={`${axleInnerClass} ${bodyRound} bg-gradient-to-b from-sky-600/30 to-sky-700/30 border border-sky-500/30`} />
              <RuedaSencilla compact={compact} vertical={vertical} isMissing={missingPositions.includes("delantero_izquierdo")} />
            </>
          )}
        </div>
      </div>

      {/* Cuerpo */}
      <div className={`flex-1 flex items-center justify-center ${bodyGap} min-w-0 min-h-0`}>
        <div className={`${bodyMainClass} ${bodyRound} bg-gradient-to-br from-sky-700/20 via-sky-600/15 to-sky-700/20 border border-dashed border-sky-500/20 flex items-center justify-center`}>
          <span className={`${labelSize} text-sky-400/50 uppercase tracking-widest font-bold ${vertical ? "-rotate-90 whitespace-nowrap" : ""}`}>
            {EJES_LABEL[tipoNorm]}
          </span>
        </div>
      </div>

      {/* Eje motriz 1 */}
      <div className={`flex ${vertical ? "flex-col" : "flex-col items-center"}`}>
        <span className={`${labelSize} uppercase tracking-wider text-slate-500 font-semibold text-center ${vertical ? "mt-1 order-last" : "mb-1"}`}>
          {tipoNorm === "3_ejes_10_ruedas" ? "M1" : "Motriz"}
        </span>
        <div className={axleContainerClass}>
          {vertical ? (
            <>
              <RuedaDoble 
                compact={compact} vertical={vertical}
                isMissingTop={missingPositions.includes("trasero_exterior_izquierdo")} 
                isMissingBottom={missingPositions.includes("trasero_interior_izquierdo")} 
              />
              <div className={`${axleInnerClass} ${bodyRound} bg-gradient-to-r from-amber-600/30 to-amber-700/30 border border-amber-500/30`} />
              <RuedaDoble 
                compact={compact} vertical={vertical}
                isMissingTop={missingPositions.includes("trasero_interior_derecho")} 
                isMissingBottom={missingPositions.includes("trasero_exterior_derecho")} 
              />
            </>
          ) : (
            <>
              <RuedaDoble 
                compact={compact} vertical={vertical}
                isMissingTop={missingPositions.includes("trasero_exterior_derecho")} 
                isMissingBottom={missingPositions.includes("trasero_interior_derecho")} 
              />
              <div className={`${axleInnerClass} ${bodyRound} bg-gradient-to-b from-amber-600/30 to-amber-700/30 border border-amber-500/30`} />
              <RuedaDoble 
                compact={compact} vertical={vertical}
                isMissingTop={missingPositions.includes("trasero_interior_izquierdo")} 
                isMissingBottom={missingPositions.includes("trasero_exterior_izquierdo")} 
              />
            </>
          )}
        </div>
      </div>

      {/* Eje motriz 2 (solo 3 ejes) */}
      {tipoNorm === "3_ejes_10_ruedas" && (
        <div className={`flex ${vertical ? "flex-col" : "flex-col items-center"}`}>
          <span className={`${labelSize} uppercase tracking-wider text-slate-500 font-semibold text-center ${vertical ? "mt-1 order-last" : "mb-1"}`}>
            M2
          </span>
          <div className={axleContainerClass}>
            {vertical ? (
              <>
                <RuedaDoble 
                  compact={compact} vertical={vertical}
                  isMissingTop={missingPositions.includes("trasero2_exterior_izquierdo")} 
                  isMissingBottom={missingPositions.includes("trasero2_interior_izquierdo")} 
                />
                <div className={`${axleInnerClass} ${bodyRound} bg-gradient-to-r from-amber-600/30 to-amber-700/30 border border-amber-500/30`} />
                <RuedaDoble 
                  compact={compact} vertical={vertical}
                  isMissingTop={missingPositions.includes("trasero2_interior_derecho")} 
                  isMissingBottom={missingPositions.includes("trasero2_exterior_derecho")} 
                />
              </>
            ) : (
              <>
                <RuedaDoble 
                  compact={compact} vertical={vertical}
                  isMissingTop={missingPositions.includes("trasero2_exterior_derecho")} 
                  isMissingBottom={missingPositions.includes("trasero2_interior_derecho")} 
                />
                <div className={`${axleInnerClass} ${bodyRound} bg-gradient-to-b from-amber-600/30 to-amber-700/30 border border-amber-500/30`} />
                <RuedaDoble 
                  compact={compact} vertical={vertical}
                  isMissingTop={missingPositions.includes("trasero2_interior_izquierdo")} 
                  isMissingBottom={missingPositions.includes("trasero2_exterior_izquierdo")} 
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
