"use client";

import { useQuery } from "@tanstack/react-query";
import type { AnomaliaMantenimiento, GastoMensual } from "./actions";
import { obtenerAnomaliasMantenimiento, obtenerGastoMensualPorUnidad } from "./actions";

export default function MantenimientoDashboard() {
  const { data: anomalias, isLoading: loadingAnomalias } = useQuery<AnomaliaMantenimiento[]>({
    queryKey: ["anomalias_mantenimiento"],
    queryFn: obtenerAnomaliasMantenimiento,
    staleTime: 1000 * 60 * 5,
  });

  const { data: gastos, isLoading: loadingGastos } = useQuery<GastoMensual[]>({
    queryKey: ["gasto_mensual"],
    queryFn: obtenerGastoMensualPorUnidad,
    staleTime: 1000 * 60 * 5,
  });

  const anomaliasData = anomalias || [];
  const gastosData = gastos || [];
  const maxGasto = gastosData.length > 0 ? Math.max(...gastosData.map((g) => g.gastoTotal)) : 0;
  const gastoTotalGlobal = gastosData.reduce((sum, g) => sum + g.gastoTotal, 0);

  if (loadingAnomalias || loadingGastos) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-dim">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4"></div>
        <p className="text-sm font-medium animate-pulse">Analizando mantenimiento...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* SECCIÓN 1: FRECUENCIA DE CAMBIOS */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            Alertas de Frecuencia de Cambios
          </h2>
          <p className="text-xs text-muted mt-1">
            Detecta piezas que se cambian más de 3 veces en 30 días, sugiriendo fallas ocultas o patrón inusual.
          </p>
        </div>

        {anomaliasData.length === 0 ? (
          <div className="bg-surface rounded-md p-6 text-center text-sm text-green flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            No se han detectado frecuencias anormales este mes.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {anomaliasData.map((a) => (
              <div key={a.id} className="bg-surface rounded-md p-5 flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center text-red animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{a.tipoPieza}</h3>
                  <p className="text-xs text-red font-medium my-1">Unidad: <span className="font-mono text-foreground">{a.patente}</span></p>
                  <p className="text-xs text-muted leading-relaxed">{a.detalle}</p>
                  <p className="text-[10px] text-dim mt-2 font-mono">
                    Registrado: {new Date(a.fechaAlerta).toLocaleString("es-CL")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN 2: GASTO MENSUAL POR UNIDAD */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            Gasto Mensual Vehicular (Mes Actual)
          </h2>
          <p className="text-xs text-muted mt-1">
            Suma de los costos en repuestos y servicios, identifica rápidamente la unidad que concentra los gastos operacionales de mantenimiento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="bg-surface rounded-md p-5 flex flex-col justify-center text-center">
            <span className="text-xs uppercase tracking-wider text-dim font-medium">Gasto Total Flota</span>
            <span className="text-3xl font-semibold text-foreground my-2">${gastoTotalGlobal.toLocaleString("es-CL")}</span>
            <span className="text-xs text-muted">Sólo Mantenimiento</span>
          </div>

          <div className="lg:col-span-3 bg-surface rounded-md p-6 overflow-x-auto">
            {gastosData.length === 0 ? (
              <p className="text-sm text-dim text-center py-6">Sin gastos registrados este mes.</p>
            ) : (
              <div className="space-y-4 min-w-[500px]">
                {gastosData.map((g, i) => {
                  const isTop = i === 0 && g.gastoTotal > 0;
                  const pct = maxGasto > 0 ? (g.gastoTotal / maxGasto) * 100 : 0;

                  return (
                    <div key={g.busId} className="flex items-center gap-4">
                      <div className="w-20 shrink-0 text-right">
                        <p className={`font-mono text-sm ${isTop ? "text-red font-medium" : "text-foreground"}`}>{g.patente}</p>
                      </div>

                      <div className="flex-1 relative h-6 rounded-md bg-surface overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ${
                            isTop ? "bg-red" : "bg-accent"
                          } ${g.gastoTotal === 0 ? "opacity-0" : "opacity-100"}`}
                          style={{ width: `${Math.max(pct, 1)}%` }}
                        />
                      </div>

                      <div className="w-24 shrink-0 font-mono text-sm font-medium text-right text-foreground">
                        ${g.gastoTotal.toLocaleString("es-CL")}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
