"use client";

import { useState } from "react";
import type { UnidadRendimiento, ComparativaGemela, AlertaEstanque } from "./actions";

/**
 * CombustibleDashboard — Client Component con 3 secciones:
 * 1. Gráfico de Tendencia de Rendimiento (Km/L) por unidad
 * 2. Comparativa de Unidades Gemelas
 * 3. Alertas de Estanque Fantasma
 */
export default function CombustibleDashboard({
  rendimiento,
  gemelas,
  alertas,
}: {
  rendimiento: UnidadRendimiento[];
  gemelas: ComparativaGemela[];
  alertas: AlertaEstanque[];
}) {
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<string>(
    rendimiento[0]?.busId || ""
  );

  const unidadActual = rendimiento.find((u) => u.busId === unidadSeleccionada);

  return (
    <div className="space-y-8">
      {/* ═══ SECCIÓN 1: TENDENCIA DE RENDIMIENTO ═══ */}
      <section>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          Tendencia de Rendimiento (Km/L)
          <span className="text-xs font-normal text-slate-500">— caída &gt;30% = alerta roja</span>
        </h2>

        {rendimiento.length === 0 ? (
          <div className="rounded border border-white/5 bg-[#121214] p-8 text-center text-sm text-slate-500">
            No hay datos suficientes. Se necesitan al menos 2 registros de combustible por unidad.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selector de unidad */}
            <div className="flex items-center gap-3 flex-wrap">
              {rendimiento.map((u) => (
                <button
                  key={u.busId}
                  type="button"
                  onClick={() => setUnidadSeleccionada(u.busId)}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    u.busId === unidadSeleccionada
                      ? u.enAlerta
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                        : "bg-sky-600 text-white shadow-lg shadow-sky-600/30"
                      : u.enAlerta
                        ? "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25"
                        : "bg-slate-700/50 text-slate-400 border border-white/10 hover:bg-white/5"
                  }`}
                >
                  {u.patente}
                  {u.enAlerta && " (Riesgo)"}
                </button>
              ))}
            </div>

            {/* Gráfico SVG + Info */}
            {unidadActual && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Stats */}
                <div className="space-y-3">
                  <StatCard
                    label="Promedio Histórico"
                    value={`${unidadActual.promedioHistorico} Km/L`}
                    color="sky"
                  />
                  <StatCard
                    label="Última Semana"
                    value={`${unidadActual.rendimientoActual} Km/L`}
                    color={unidadActual.enAlerta ? "red" : "emerald"}
                  />
                  <StatCard
                    label="Variación"
                    value={`${unidadActual.variacionPct > 0 ? "+" : ""}${unidadActual.variacionPct}%`}
                    color={unidadActual.variacionPct < -30 ? "red" : unidadActual.variacionPct < 0 ? "amber" : "emerald"}
                  />
                  {unidadActual.enAlerta && (
                    <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-medium animate-pulse">
                      ALERTA CRÍTICA: Rendimiento anormalmente bajo. Posible extracción de combustible.
                    </div>
                  )}
                </div>

                {/* Gráfico SVG */}
                <div className="lg:col-span-3 rounded border border-white/5 bg-[#121214] p-4">
                  <RendimientoChart
                    semanas={unidadActual.semanas}
                    promedio={unidadActual.promedioHistorico}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ═══ SECCIÓN 2: COMPARATIVA DE GEMELAS ═══ */}
      <section>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          Comparativa de Unidades Gemelas
          <span className="text-xs font-normal text-slate-500">— diferencia &gt;30% = alerta</span>
        </h2>

        {gemelas.length === 0 ? (
          <div className="rounded border border-white/5 bg-[#121214] p-8 text-center text-sm text-slate-500">
            No hay unidades gemelas (misma marca, modelo y año) para comparar.
          </div>
        ) : (
          <div className="space-y-4">
            {gemelas.map((g) => (
              <div
                key={g.grupo}
                className={`rounded border p-5 ${
                  g.enAlerta
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-white/5 bg-[#121214]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{g.grupo}</h3>
                    <p className="text-xs text-slate-500">{g.unidades.length} unidades</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    g.enAlerta
                      ? "bg-red-500/20 text-red-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    Δ {g.diferenciaMaxPct}%
                  </span>
                </div>

                <div className="grid gap-2">
                  {g.unidades.map((u, i) => {
                    const maxRend = Math.max(...g.unidades.map((x) => x.promedioKmL));
                    const pct = maxRend > 0 ? (u.promedioKmL / maxRend) * 100 : 0;
                    const esPeor = g.enAlerta && u.promedioKmL === Math.min(...g.unidades.map((x) => x.promedioKmL));

                    return (
                      <div key={u.busId} className="flex items-center gap-3">
                        <span className={`font-mono text-xs w-20 ${esPeor ? "text-red-400 font-bold" : "text-white"}`}>
                          {u.patente}
                        </span>
                        <div className="flex-1 h-6 rounded-full bg-slate-700/50 overflow-hidden relative">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              esPeor ? "bg-red-500" : "bg-sky-500"
                            }`}
                            style={{ width: `${Math.max(pct, 5)}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                            {u.promedioKmL} Km/L
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 w-24 text-right">
                          {u.totalKm.toLocaleString("es-CL")} km
                        </span>
                      </div>
                    );
                  })}
                </div>

                {g.enAlerta && (
                  <p className="mt-3 text-xs text-red-400 font-medium">
                    ATENCIÓN: Diferencia de rendimiento &gt;30%. Investigar conductor o fuga.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══ SECCIÓN 3: ALERTAS ESTANQUE FANTASMA ═══ */}
      <section>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          Alertas de Estanque Fantasma
          <span className="text-xs font-normal text-slate-500">— intentos de carga &gt; capacidad del estanque</span>
        </h2>

        {alertas.length === 0 ? (
          <div className="rounded border border-emerald-500/20 bg-emerald-500/5 p-6 text-center text-sm text-emerald-400 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Sin alertas de estanque fantasma. Todo en orden.
          </div>
        ) : (
          <div className="space-y-2">
            {alertas.map((a) => (
              <div key={a.id} className="rounded border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-red-600/20 text-red-400 text-lg shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{a.titulo}</p>
                  <p className="text-xs text-slate-400">
                    Unidad: <span className="font-mono text-white">{a.patente}</span> · {new Date(a.fecha).toLocaleDateString("es-CL")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ═══ COMPONENTES AUXILIARES ═══

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    sky: "border-sky-500/20 bg-sky-500/5 text-sky-400",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    red: "border-red-500/20 bg-red-500/5 text-red-400",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
  };

  return (
    <div className={`rounded border p-3 ${colorMap[color] || colorMap.sky}`}>
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

/**
 * Gráfico SVG de rendimiento semanal (línea con puntos).
 */
function RendimientoChart({
  semanas,
  promedio,
}: {
  semanas: { semana: string; rendimiento: number }[];
  promedio: number;
}) {
  if (semanas.length === 0) {
    return <p className="text-center text-sm text-slate-500 py-8">Sin datos</p>;
  }

  const W = 600;
  const H = 200;
  const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...semanas.map((s) => s.rendimiento), promedio) * 1.2;
  const minVal = 0;

  const xStep = semanas.length > 1 ? chartW / (semanas.length - 1) : chartW / 2;

  function toX(i: number) {
    return PAD.left + (semanas.length > 1 ? i * xStep : chartW / 2);
  }
  function toY(val: number) {
    return PAD.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
  }

  // Línea path
  const linePath = semanas
    .map((s, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(s.rendimiento)}`)
    .join(" ");

  // Umbral de alerta (-30%)
  const umbral = promedio * 0.7;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = PAD.top + chartH * (1 - pct);
        const val = (minVal + (maxVal - minVal) * pct).toFixed(1);
        return (
          <g key={pct}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#334155" strokeWidth={0.5} />
            <text x={PAD.left - 6} y={y + 3} textAnchor="end" className="fill-slate-500 text-[9px]">{val}</text>
          </g>
        );
      })}

      {/* Zona roja (bajo umbral) */}
      <rect
        x={PAD.left}
        y={toY(umbral)}
        width={chartW}
        height={PAD.top + chartH - toY(umbral)}
        fill="#ef4444"
        opacity={0.05}
      />

      {/* Línea de promedio */}
      <line
        x1={PAD.left}
        y1={toY(promedio)}
        x2={W - PAD.right}
        y2={toY(promedio)}
        stroke="#38bdf8"
        strokeWidth={1}
        strokeDasharray="6 3"
        opacity={0.5}
      />
      <text x={W - PAD.right + 2} y={toY(promedio) - 4} className="fill-sky-400 text-[8px]">
        Prom.
      </text>

      {/* Línea de umbral */}
      <line
        x1={PAD.left}
        y1={toY(umbral)}
        x2={W - PAD.right}
        y2={toY(umbral)}
        stroke="#ef4444"
        strokeWidth={1}
        strokeDasharray="4 4"
        opacity={0.4}
      />
      <text x={W - PAD.right + 2} y={toY(umbral) - 4} className="fill-red-400 text-[8px]">
        -30%
      </text>

      {/* Línea de datos */}
      <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Puntos de datos */}
      {semanas.map((s, i) => (
        <g key={s.semana}>
          <circle
            cx={toX(i)}
            cy={toY(s.rendimiento)}
            r={4}
            fill={s.rendimiento < umbral ? "#ef4444" : "#f59e0b"}
            stroke={s.rendimiento < umbral ? "#ef4444" : "#f59e0b"}
            strokeWidth={2}
          />
          {/* Etiquetas X */}
          <text
            x={toX(i)}
            y={H - PAD.bottom + 14}
            textAnchor="middle"
            className="fill-slate-500 text-[8px]"
          >
            {s.semana.replace(/^\d{4}-/, "")}
          </text>
          {/* Valor sobre punto */}
          <text
            x={toX(i)}
            y={toY(s.rendimiento) - 8}
            textAnchor="middle"
            className={`text-[9px] font-bold ${s.rendimiento < umbral ? "fill-red-400" : "fill-amber-400"}`}
          >
            {s.rendimiento}
          </text>
        </g>
      ))}

      {/* Label eje Y */}
      <text x={12} y={PAD.top + chartH / 2} textAnchor="middle" transform={`rotate(-90, 12, ${PAD.top + chartH / 2})`} className="fill-slate-500 text-[9px]">
        Km/L
      </text>
    </svg>
  );
}
