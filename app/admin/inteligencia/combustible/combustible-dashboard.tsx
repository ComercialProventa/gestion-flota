"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { UnidadRendimiento, ComparativaGemela, AlertaEstanque } from "./actions";
import { obtenerRendimientoFlota, obtenerComparativaGemelas, obtenerAlertasEstanque } from "./actions";

export default function CombustibleDashboard() {
  const { data: rendimiento, isLoading: loadingRendimiento } = useQuery<UnidadRendimiento[]>({
    queryKey: ["rendimiento_flota"],
    queryFn: obtenerRendimientoFlota,
    staleTime: 1000 * 60 * 5,
  });

  const { data: gemelas, isLoading: loadingGemelas } = useQuery<ComparativaGemela[]>({
    queryKey: ["comparativa_gemelas"],
    queryFn: obtenerComparativaGemelas,
    staleTime: 1000 * 60 * 5,
  });

  const { data: alertas, isLoading: loadingAlertas } = useQuery<AlertaEstanque[]>({
    queryKey: ["alertas_estanque"],
    queryFn: obtenerAlertasEstanque,
    staleTime: 1000 * 60 * 5,
  });

  const rendimientoData = rendimiento || [];
  const gemelasData = gemelas || [];
  const alertasData = alertas || [];

  const [unidadSeleccionada, setUnidadSeleccionada] = useState<string>(
    rendimientoData[0]?.busId || ""
  );

  const unidadActual = rendimientoData.find((u) => u.busId === unidadSeleccionada);

  if (loadingRendimiento || loadingGemelas || loadingAlertas) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-dim">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4"></div>
        <p className="text-sm font-medium animate-pulse">Analizando datos de combustible...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* SECCIÓN 1: TENDENCIA DE RENDIMIENTO */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          Tendencia de Rendimiento (Km/L)
          <span className="text-xs font-normal text-dim">— caída &gt;30% = alerta roja</span>
        </h2>

        {rendimientoData.length === 0 ? (
          <div className="bg-surface rounded-md p-8 text-center text-sm text-dim">
            No hay datos suficientes. Se necesitan al menos 2 registros de combustible por unidad.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              {rendimientoData.map((u) => (
                <button
                  key={u.busId}
                  type="button"
                  onClick={() => setUnidadSeleccionada(u.busId)}
                  className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-all cursor-pointer ${
                    u.busId === unidadSeleccionada
                      ? u.enAlerta
                        ? "text-red"
                        : "text-accent"
                      : u.enAlerta
                        ? "text-red"
                        : "text-dim hover:text-foreground"
                  }`}
                >
                  {u.patente}
                  {u.enAlerta && " (Riesgo)"}
                </button>
              ))}
            </div>

            {unidadActual && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="space-y-3">
                  <StatCard
                    label="Promedio Histórico"
                    value={`${unidadActual.promedioHistorico} Km/L`}
                    color="accent"
                  />
                  <StatCard
                    label="Última Semana"
                    value={`${unidadActual.rendimientoActual} Km/L`}
                    color={unidadActual.enAlerta ? "red" : "green"}
                  />
                  <StatCard
                    label="Variación"
                    value={`${unidadActual.variacionPct > 0 ? "+" : ""}${unidadActual.variacionPct}%`}
                    color={unidadActual.variacionPct < -30 ? "red" : unidadActual.variacionPct < 0 ? "accent" : "green"}
                  />
                  {unidadActual.enAlerta && (
                    <div className="text-xs text-red animate-pulse">
                      ALERTA CRÍTICA: Rendimiento anormalmente bajo. Posible extracción de combustible.
                    </div>
                  )}
                </div>

                <div className="lg:col-span-3 bg-surface rounded-md p-4">
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

      {/* SECCIÓN 2: COMPARATIVA DE GEMELAS */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          Comparativa de Unidades Gemelas
          <span className="text-xs font-normal text-dim">— diferencia &gt;30% = alerta</span>
        </h2>

        {gemelasData.length === 0 ? (
          <div className="bg-surface rounded-md p-8 text-center text-sm text-dim">
            No hay unidades gemelas (misma marca, modelo y año) para comparar.
          </div>
        ) : (
          <div className="space-y-4">
            {gemelasData.map((g) => (
              <div
                key={g.grupo}
                className={`bg-surface rounded-md p-5 ${
                  g.enAlerta ? "ring-1 ring-red/20" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{g.grupo}</h3>
                    <p className="text-xs text-dim">{g.unidades.length} unidades</p>
                  </div>
                  <span className={`text-xs font-medium ${
                    g.enAlerta ? "text-red" : "text-green"
                  }`}>
                    Δ {g.diferenciaMaxPct}%
                  </span>
                </div>

                <div className="grid gap-2">
                  {g.unidades.map((u) => {
                    const maxRend = Math.max(...g.unidades.map((x) => x.promedioKmL));
                    const pct = maxRend > 0 ? (u.promedioKmL / maxRend) * 100 : 0;
                    const esPeor = g.enAlerta && u.promedioKmL === Math.min(...g.unidades.map((x) => x.promedioKmL));

                    return (
                      <div key={u.busId} className="flex items-center gap-3">
                        <span className={`font-mono text-xs w-20 ${esPeor ? "text-red font-medium" : "text-foreground"}`}>
                          {u.patente}
                        </span>
                        <div className="flex-1 h-6 rounded-md bg-surface overflow-hidden relative">
                          <div
                            className={`h-full transition-all duration-500 ${
                              esPeor ? "bg-red" : "bg-accent"
                            }`}
                            style={{ width: `${Math.max(pct, 5)}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-foreground">
                            {u.promedioKmL} Km/L
                          </span>
                        </div>
                        <span className="text-[10px] text-dim w-24 text-right">
                          {u.totalKm.toLocaleString("es-CL")} km
                        </span>
                      </div>
                    );
                  })}
                </div>

                {g.enAlerta && (
                  <p className="mt-3 text-xs text-red font-medium">
                    ATENCIÓN: Diferencia de rendimiento &gt;30%. Investigar conductor o fuga.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN 3: ALERTAS ESTANQUE FANTASMA */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          Alertas de Estanque Fantasma
          <span className="text-xs font-normal text-dim">— intentos de carga &gt; capacidad del estanque</span>
        </h2>

        {alertasData.length === 0 ? (
          <div className="bg-surface rounded-md p-6 text-center text-sm text-green flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Sin alertas de estanque fantasma. Todo en orden.
          </div>
        ) : (
          <div className="space-y-2">
            {alertasData.map((a) => (
              <div key={a.id} className="bg-surface rounded-md p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center text-red shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{a.titulo}</p>
                  <p className="text-xs text-muted">
                    Unidad: <span className="font-mono text-foreground">{a.patente}</span> · {new Date(a.fecha).toLocaleDateString("es-CL")}
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

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    accent: "text-accent",
    green: "text-green",
    red: "text-red",
  };

  return (
    <div className="bg-surface rounded-md p-3">
      <p className="text-[10px] uppercase tracking-wider text-dim">{label}</p>
      <p className={`text-lg font-semibold ${colorMap[color] || colorMap.accent}`}>{value}</p>
    </div>
  );
}

function RendimientoChart({
  semanas,
  promedio,
}: {
  semanas: { semana: string; rendimiento: number }[];
  promedio: number;
}) {
  if (semanas.length === 0) {
    return <p className="text-center text-sm text-dim py-8">Sin datos</p>;
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

  const linePath = semanas
    .map((s, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(s.rendimiento)}`)
    .join(" ");

  const umbral = promedio * 0.7;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = PAD.top + chartH * (1 - pct);
        const val = (minVal + (maxVal - minVal) * pct).toFixed(1);
        return (
          <g key={pct}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#3f3f46" strokeWidth={0.5} />
            <text x={PAD.left - 6} y={y + 3} textAnchor="end" className="fill-dim text-[9px]">{val}</text>
          </g>
        );
      })}

      <rect
        x={PAD.left}
        y={toY(umbral)}
        width={chartW}
        height={PAD.top + chartH - toY(umbral)}
        fill="#ef4444"
        opacity={0.05}
      />

      <line
        x1={PAD.left}
        y1={toY(promedio)}
        x2={W - PAD.right}
        y2={toY(promedio)}
        stroke="#f59e0b"
        strokeWidth={1}
        strokeDasharray="6 3"
        opacity={0.5}
      />
      <text x={W - PAD.right + 2} y={toY(promedio) - 4} className="fill-accent text-[8px]">
        Prom.
      </text>

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
      <text x={W - PAD.right + 2} y={toY(umbral) - 4} className="fill-red text-[8px]">
        -30%
      </text>

      <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

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
          <text
            x={toX(i)}
            y={H - PAD.bottom + 14}
            textAnchor="middle"
            className="fill-dim text-[8px]"
          >
            {s.semana.replace(/^\d{4}-/, "")}
          </text>
          <text
            x={toX(i)}
            y={toY(s.rendimiento) - 8}
            textAnchor="middle"
            className={`text-[9px] font-semibold ${s.rendimiento < umbral ? "fill-red" : "fill-accent"}`}
          >
            {s.rendimiento}
          </text>
        </g>
      ))}

      <text x={12} y={PAD.top + chartH / 2} textAnchor="middle" transform={`rotate(-90, 12, ${PAD.top + chartH / 2})`} className="fill-dim text-[9px]">
        Km/L
      </text>
    </svg>
  );
}
