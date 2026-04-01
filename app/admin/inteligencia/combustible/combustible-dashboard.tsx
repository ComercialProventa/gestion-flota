"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UnidadRendimiento, RankingItem, ComparativaGemela, AlertaEstanque, KpiResumen } from "./actions";
import { obtenerRendimientoFlota, obtenerRanking, obtenerKpis, obtenerComparativaGemelas, obtenerAlertasEstanque, resolverAlerta } from "./actions";

function toISO(d: Date): string { return d.toISOString().split("T")[0]; }
function fmt(n: number): string { return n.toLocaleString("es-CL"); }
function periodoAnterior(desde: string, hasta: string): { desde: string; hasta: string } {
  const d1 = new Date(desde); const d2 = new Date(hasta);
  const dias = Math.ceil((d2.getTime() - d1.getTime()) / 86400000);
  const antHasta = new Date(d1); antHasta.setDate(antHasta.getDate() - 1);
  const antDesde = new Date(antHasta); antDesde.setDate(antDesde.getDate() - dias);
  return { desde: toISO(antDesde), hasta: toISO(antHasta) };
}

const PRESETS = [
  { label: "Esta semana", desde: () => { const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1); return toISO(d); }, hasta: () => toISO(new Date()) },
  { label: "Semana pasada", desde: () => { const d = new Date(); d.setDate(d.getDate() - d.getDay() - 6); return toISO(d); }, hasta: () => { const d = new Date(); d.setDate(d.getDate() - d.getDay()); return toISO(d); } },
  { label: "Este mes", desde: () => { const d = new Date(); d.setDate(1); return toISO(d); }, hasta: () => toISO(new Date()) },
  { label: "Mes pasado", desde: () => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 1); return toISO(d); }, hasta: () => { const d = new Date(); d.setDate(0); return toISO(d); } },
  { label: "Últimos 3 meses", desde: () => { const d = new Date(); d.setMonth(d.getMonth() - 3); return toISO(d); }, hasta: () => toISO(new Date()) },
  { label: "Este año", desde: () => { const d = new Date(); d.setMonth(0, 1); return toISO(d); }, hasta: () => toISO(new Date()) },
];

export default function CombustibleDashboard() {
  const queryClient = useQueryClient();

  // Fechas por defecto: últimos 3 meses
  const [desde, setDesde] = useState(() => { const d = new Date(); d.setMonth(d.getMonth() - 3); return toISO(d); });
  const [hasta, setHasta] = useState(() => toISO(new Date()));
  const [comparar, setComparar] = useState(false);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<string>("");
  const [inputDesde, setInputDesde] = useState(desde);
  const [inputHasta, setInputHasta] = useState(hasta);

  function aplicarFechas(d: string, h: string) { setDesde(d); setHasta(h); setInputDesde(d); setInputHasta(h); }

  // Periodo anterior para comparación
  const ant = useMemo(() => periodoAnterior(desde, hasta), [desde, hasta]);

  // Queries del periodo actual
  const { data: rendimiento, isLoading: l1 } = useQuery<UnidadRendimiento[]>({ queryKey: ["rendimiento", desde, hasta], queryFn: () => obtenerRendimientoFlota(desde, hasta), staleTime: 1000 * 60 * 5 });
  const { data: ranking, isLoading: l2 } = useQuery<RankingItem[]>({ queryKey: ["ranking", desde, hasta], queryFn: () => obtenerRanking(desde, hasta), staleTime: 1000 * 60 * 5 });
  const { data: kpis, isLoading: l3 } = useQuery<KpiResumen>({ queryKey: ["kpis", desde, hasta], queryFn: () => obtenerKpis(desde, hasta), staleTime: 1000 * 60 * 5 });
  const { data: gemelas, isLoading: l4 } = useQuery<ComparativaGemela[]>({ queryKey: ["gemelas", desde, hasta], queryFn: () => obtenerComparativaGemelas(desde, hasta), staleTime: 1000 * 60 * 5 });
  const { data: alertas } = useQuery<AlertaEstanque[]>({ queryKey: ["alertas"], queryFn: obtenerAlertasEstanque, staleTime: 1000 * 60 * 5 });

  // Queries del periodo anterior (solo si comparar está activo)
  const { data: kpisAnt } = useQuery<KpiResumen>({ queryKey: ["kpis", ant.desde, ant.hasta], queryFn: () => obtenerKpis(ant.desde, ant.hasta), staleTime: 1000 * 60 * 5, enabled: comparar });

  const rendimientoData = rendimiento || [];
  const rankingData = ranking || [];
  const gemelasData = gemelas || [];
  const alertasData = alertas || [];
  const kpisData = kpis || { rendimientoPromedioFlota: 0, costoPorKmPromedio: null, gastoTotalPeriodo: 0, kmTotalesPeriodo: 0, unidadesConAlerta: 0, totalUnidades: 0 };

  const unidadActual = rendimientoData.find((u) => u.busId === unidadSeleccionada) || rendimientoData[0];

  const resolverMutation = useMutation({
    mutationFn: (id: string) => resolverAlerta(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alertas"] }),
  });

  const loading = l1 || l2 || l3 || l4;

  return (
    <div className="space-y-10">
      {/* DATE RANGE PICKER */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-[10px] font-medium text-dim mb-1">Desde</label>
          <input type="date" value={inputDesde} onChange={(e) => setInputDesde(e.target.value)} onBlur={() => aplicarFechas(inputDesde, inputHasta)}
            className="bg-surface rounded-md px-3 py-1.5 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/30" style={{ colorScheme: "dark" }} />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-dim mb-1">Hasta</label>
          <input type="date" value={inputHasta} onChange={(e) => setInputHasta(e.target.value)} onBlur={() => aplicarFechas(inputDesde, inputHasta)}
            className="bg-surface rounded-md px-3 py-1.5 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/30" style={{ colorScheme: "dark" }} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => aplicarFechas(p.desde(), p.hasta())}
              className="px-2 py-1 rounded text-[10px] text-dim hover:text-foreground hover:bg-surface transition-colors cursor-pointer">
              {p.label}
            </button>
          ))}
        </div>
        <button onClick={() => setComparar(!comparar)}
          className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${comparar ? "text-accent bg-surface-hover" : "text-dim hover:text-foreground"}`}>
          {comparar ? "✓ Comparando" : "Comparar con anterior"}
        </button>
      </div>

      {/* COMPARACIÓN */}
      {comparar && kpisAnt && (
        <div className="text-[11px] text-dim">
          Comparando con: <span className="text-foreground">{ant.desde}</span> → <span className="text-foreground">{ant.hasta}</span>
        </div>
      )}

      {/* KPIs */}
      {loading ? (
        <div className="py-8 text-center text-dim text-[13px]">Cargando datos...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          <KpiComparativo label="Rendimiento Promedio" valor={`${kpisData.rendimientoPromedioFlota} Km/L`} anterior={comparar && kpisAnt ? `${kpisAnt.rendimientoPromedioFlota} Km/L` : null} />
          <KpiComparativo label="Costo / Km" valor={kpisData.costoPorKmPromedio !== null ? `$${fmt(kpisData.costoPorKmPromedio)}` : "—"} anterior={comparar && kpisAnt?.costoPorKmPromedio !== null ? `$${fmt(kpisAnt!.costoPorKmPromedio!)}` : null} invertir />
          <KpiComparativo label="Gasto Total" valor={`$${fmt(kpisData.gastoTotalPeriodo)}`} anterior={comparar && kpisAnt ? `$${fmt(kpisAnt.gastoTotalPeriodo)}` : null} invertir />
          <KpiComparativo label="Km Recorridos" valor={`${fmt(kpisData.kmTotalesPeriodo)} km`} anterior={comparar && kpisAnt ? `${fmt(kpisAnt.kmTotalesPeriodo)} km` : null} />
          <div>
            <p className="text-[10px] text-dim uppercase tracking-wide">Alertas</p>
            <p className={`text-[18px] font-semibold mt-0.5 ${kpisData.unidadesConAlerta > 0 ? "text-red" : "text-green"}`}>{kpisData.unidadesConAlerta} / {kpisData.totalUnidades}</p>
          </div>
        </div>
      )}

      {/* RANKING */}
      <section>
        <h2 className="text-[11px] font-medium text-dim uppercase tracking-wide mb-3">Ranking de Eficiencia</h2>
        {rankingData.length === 0 ? (
          <p className="text-[13px] text-dim py-8">No hay datos suficientes. Se necesitan al menos 2 registros por unidad.</p>
        ) : (
          <div>
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-medium text-dim uppercase tracking-wide">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Unidad</div>
              <div className="col-span-2">Km/L</div>
              <div className="col-span-2">Costo/Km</div>
              <div className="col-span-2">Gasto</div>
              <div className="col-span-2">Km</div>
            </div>
            <div className="divide-y divide-divider">
              {rankingData.map((r, i) => (
                <div key={r.busId} className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 px-4 py-3 hover:bg-surface transition-colors">
                  <div className="hidden md:block md:col-span-1"><span className={`text-[12px] font-mono ${i < 3 ? "text-red" : "text-dim"}`}>{i + 1}</span></div>
                  <div className="md:col-span-3">
                    <span className={`text-[13px] font-mono font-medium ${r.enAlerta ? "text-red" : "text-foreground"}`}>{r.patente}</span>
                    <span className="text-[11px] text-dim ml-2">{r.marca} {r.modelo}</span>
                  </div>
                  <div className="md:col-span-2"><span className={`text-[13px] font-mono font-medium ${r.enAlerta ? "text-red" : r.kmL >= 3 ? "text-green" : "text-foreground"}`}>{r.kmL}</span></div>
                  <div className="md:col-span-2"><span className="text-[12px] font-mono text-accent">{r.costoPorKm !== null ? `$${fmt(r.costoPorKm)}` : "—"}</span></div>
                  <div className="hidden md:block md:col-span-2"><span className="text-[12px] text-muted">${fmt(r.gastoTotal)}</span></div>
                  <div className="hidden md:block md:col-span-2"><span className="text-[12px] text-muted">{fmt(r.kmTotal)} km</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* TENDENCIA */}
      {rendimientoData.length > 0 && (
        <section>
          <h2 className="text-[11px] font-medium text-dim uppercase tracking-wide mb-3">Tendencia Semanal</h2>
          <div className="flex gap-2 flex-wrap mb-4">
            {rendimientoData.map((u) => (
              <button key={u.busId} onClick={() => setUnidadSeleccionada(u.busId)}
                className={`px-3 py-1 rounded-md text-[12px] font-mono transition-colors cursor-pointer ${
                  (unidadActual?.busId === u.busId) ? (u.enAlerta ? "text-red bg-surface-hover" : "text-accent bg-surface-hover") : (u.enAlerta ? "text-red" : "text-dim hover:text-foreground")
                }`}>
                {u.patente}{u.enAlerta && " ⚠"}
              </button>
            ))}
          </div>
          {unidadActual && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="space-y-3">
                <Stat label="Promedio" value={`${unidadActual.promedioHistorico} Km/L`} color="text-foreground" />
                <Stat label="Último Periodo" value={`${unidadActual.rendimientoActual} Km/L`} color={unidadActual.enAlerta ? "text-red" : "text-green"} />
                <Stat label="Variación" value={`${unidadActual.variacionPct > 0 ? "+" : ""}${unidadActual.variacionPct}%`} color={unidadActual.variacionPct < -30 ? "text-red" : unidadActual.variacionPct < 0 ? "text-accent" : "text-green"} />
                {unidadActual.costoPorKm !== null && <Stat label="Costo/Km" value={`$${fmt(unidadActual.costoPorKm)}`} color="text-accent" />}
                {unidadActual.enAlerta && <p className="text-[11px] text-red">Rendimiento anormalmente bajo. Revisar cargas de las últimas semanas y conductor asignado.</p>}
              </div>
              <div className="lg:col-span-3 bg-surface rounded-md p-4">
                <RendimientoChart semanas={unidadActual.semanas} promedio={unidadActual.promedioHistorico} />
              </div>
            </div>
          )}
        </section>
      )}

      {/* GEMELAS */}
      {gemelasData.length > 0 && (
        <section>
          <h2 className="text-[11px] font-medium text-dim uppercase tracking-wide mb-3">Comparativa Gemelas</h2>
          <div className="space-y-3">
            {gemelasData.map((g) => (
              <div key={g.grupo} className={`bg-surface rounded-md p-4 ${g.enAlerta ? "ring-1 ring-red/20" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <div><span className="text-[13px] font-medium text-foreground">{g.grupo}</span><span className="text-[11px] text-dim ml-2">{g.unidades.length} unidades</span></div>
                  <span className={`text-[12px] font-medium ${g.enAlerta ? "text-red" : "text-green"}`}>Δ {g.diferenciaMaxPct}%</span>
                </div>
                <div className="space-y-1.5">
                  {g.unidades.map((u) => {
                    const maxR = Math.max(...g.unidades.map((x) => x.promedioKmL));
                    const pct = maxR > 0 ? (u.promedioKmL / maxR) * 100 : 0;
                    const esPeor = g.enAlerta && u.promedioKmL === Math.min(...g.unidades.map((x) => x.promedioKmL));
                    return (
                      <div key={u.busId} className="flex items-center gap-3">
                        <span className={`font-mono text-[11px] w-20 ${esPeor ? "text-red" : "text-foreground"}`}>{u.patente}</span>
                        <div className="flex-1 h-5 bg-surface-hover rounded-sm overflow-hidden relative">
                          <div className={`h-full ${esPeor ? "bg-red" : "bg-accent"}`} style={{ width: `${Math.max(pct, 5)}%` }} />
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-foreground">{u.promedioKmL} Km/L</span>
                        </div>
                        <span className="text-[10px] text-dim w-20 text-right">{fmt(u.totalKm)} km</span>
                      </div>
                    );
                  })}
                </div>
                {g.enAlerta && <p className="mt-2 text-[11px] text-red">Diferencia &gt;30%. Investigar conductor o mecánica.</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ALERTAS */}
      <section>
        <h2 className="text-[11px] font-medium text-dim uppercase tracking-wide mb-3">Alertas de Estanque Fantasma</h2>
        {alertasData.length === 0 ? (
          <p className="text-[13px] text-green py-4">Sin alertas activas. Todo en orden.</p>
        ) : (
          <div className="space-y-2">
            {alertasData.map((a) => (
              <div key={a.id} className="flex items-center gap-4 py-3 hover:bg-surface transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] text-foreground">{a.titulo}</span>
                  <span className="text-[11px] text-dim ml-2 font-mono">{a.patente}</span>
                  <span className="text-[11px] text-dim ml-2">{new Date(a.fecha).toLocaleDateString("es-CL")}</span>
                </div>
                <button onClick={() => resolverMutation.mutate(a.id)} disabled={resolverMutation.isPending}
                  className="text-[11px] text-dim hover:text-green transition-colors cursor-pointer shrink-0">
                  Resolver
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── SUB-COMPONENTES ────────────────────────────────────────

function KpiComparativo({ label, valor, anterior, invertir }: { label: string; valor: string; anterior: string | null; invertir?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-dim uppercase tracking-wide">{label}</p>
      <p className="text-[18px] font-semibold text-foreground mt-0.5">{valor}</p>
      {anterior && (
        <p className="text-[10px] text-dim mt-0.5">
          vs anterior: <span className="text-muted">{anterior}</span>
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="text-[10px] text-dim uppercase tracking-wide">{label}</p>
      <p className={`text-[15px] font-semibold mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}

function RendimientoChart({ semanas, promedio }: { semanas: { semana: string; rendimiento: number }[]; promedio: number }) {
  if (semanas.length === 0) return <p className="text-center text-[13px] text-dim py-8">Sin datos</p>;

  const W = 600; const H = 200;
  const PAD = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...semanas.map((s) => s.rendimiento), promedio) * 1.2;
  const xStep = semanas.length > 1 ? chartW / (semanas.length - 1) : chartW / 2;
  const toX = (i: number) => PAD.left + (semanas.length > 1 ? i * xStep : chartW / 2);
  const toY = (val: number) => PAD.top + chartH - (val / maxVal) * chartH;
  const linePath = semanas.map((s, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(s.rendimiento)}`).join(" ");
  const umbral = promedio * 0.7;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = PAD.top + chartH * (1 - pct);
        return (
          <g key={pct}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#3f3f46" strokeWidth={0.5} />
            <text x={PAD.left - 6} y={y + 3} textAnchor="end" className="fill-dim text-[9px]">{(maxVal * pct).toFixed(1)}</text>
          </g>
        );
      })}
      <rect x={PAD.left} y={toY(umbral)} width={chartW} height={PAD.top + chartH - toY(umbral)} fill="#ef4444" opacity={0.05} />
      <line x1={PAD.left} y1={toY(promedio)} x2={W - PAD.right} y2={toY(promedio)} stroke="#f59e0b" strokeWidth={1} strokeDasharray="6 3" opacity={0.5} />
      <text x={W - PAD.right + 2} y={toY(promedio) - 4} className="fill-accent text-[8px]">Prom.</text>
      <line x1={PAD.left} y1={toY(umbral)} x2={W - PAD.right} y2={toY(umbral)} stroke="#ef4444" strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />
      <text x={W - PAD.right + 2} y={toY(umbral) - 4} className="fill-red text-[8px]">-30%</text>
      <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {semanas.map((s, i) => (
        <g key={s.semana}>
          <circle cx={toX(i)} cy={toY(s.rendimiento)} r={4} fill={s.rendimiento < umbral ? "#ef4444" : "#f59e0b"} />
          <text x={toX(i)} y={H - PAD.bottom + 14} textAnchor="middle" className="fill-dim text-[8px]">{s.semana.replace(/^\d{4}-/, "")}</text>
          <text x={toX(i)} y={toY(s.rendimiento) - 8} textAnchor="middle" className={`text-[9px] font-semibold ${s.rendimiento < umbral ? "fill-red" : "fill-accent"}`}>{s.rendimiento}</text>
        </g>
      ))}
      <text x={12} y={PAD.top + chartH / 2} textAnchor="middle" transform={`rotate(-90, 12, ${PAD.top + chartH / 2})`} className="fill-dim text-[9px]">Km/L</text>
    </svg>
  );
}
