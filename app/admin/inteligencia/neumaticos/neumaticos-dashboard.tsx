"use client";

import { useQuery } from "@tanstack/react-query";
import type { RankingCPK, AlertaCambiazo } from "./actions";
import { obtenerRankingCPK, obtenerAlertasCambiazo } from "./actions";

export default function NeumaticosDashboard() {
  const { data: ranking, isLoading: loadingRanking } = useQuery<RankingCPK[]>({
    queryKey: ["ranking_cpk"],
    queryFn: obtenerRankingCPK,
    staleTime: 1000 * 60 * 10,
  });

  const { data: alertas, isLoading: loadingAlertas } = useQuery<AlertaCambiazo[]>({
    queryKey: ["alertas_cambiazo"],
    queryFn: obtenerAlertasCambiazo,
    staleTime: 1000 * 60 * 10,
  });

  const rankingData = ranking || [];
  const alertasData = alertas || [];

  if (loadingRanking || loadingAlertas) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-dim">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4"></div>
        <p className="text-sm font-medium animate-pulse">Analizando datos de neumáticos...</p>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* SECCIÓN 1: RANKING CPK */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            Ranking de Rentabilidad (Costo por Kilómetro)
          </h2>
          <p className="text-xs text-muted mt-1">
            Basado en el precio de compra y los kilómetros reales recorridos antes del reciclaje.
          </p>
        </div>

        {rankingData.length === 0 ? (
          <div className="bg-surface rounded-md p-8 text-center text-sm text-dim">
            No hay neumáticos reciclados con precio registrado para calcular el CPK.
          </div>
        ) : (
          <div className="bg-surface rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-border text-[11px] font-medium text-dim uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-3">Modelo</th>
                    <th className="px-5 py-3 text-right">Rend. Medio</th>
                    <th className="px-5 py-3 text-right">Precio Prom.</th>
                    <th className="px-5 py-3 text-accent text-right">CPK ($/Km)</th>
                    <th className="px-5 py-3 text-center">Rentabilidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                  {rankingData.map((r, i) => (
                    <tr key={r.modeloId} className="hover:bg-surface-hover transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-dim font-mono w-5 text-center">
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-medium text-foreground">{r.marca}</p>
                            <p className="text-xs text-dim">{r.medida} · {r.muestras} muestra{r.muestras !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right text-foreground font-mono text-xs">
                        {r.rendimientoRealKmPromedio.toLocaleString("es-CL")} km
                        <div className="text-[10px] text-dim mt-0.5">
                          esperado: {r.vidaUtilEstimadaKm.toLocaleString("es-CL")}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right text-foreground font-mono text-xs">
                        ${r.precioPromedio.toLocaleString("es-CL")}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-medium text-accent">
                        ${r.cpk.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-[11px] font-medium uppercase tracking-wide ${
                          r.rentabilidad === "buena" ? "text-green" :
                          r.rentabilidad === "mala" ? "text-red" :
                          "text-accent"
                        }`}>
                          {r.rentabilidad}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* SECCIÓN 2: ALERTA EL CAMBIAZO */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            Auditoría: "El Cambiazo"
          </h2>
          <p className="text-xs text-muted mt-1">
            Neumáticos enviados a reciclaje con <span className="text-red font-medium">menos del 20%</span> de su vida útil esperada. Posible venta en ruta.
          </p>
        </div>

        {alertasData.length === 0 ? (
          <div className="bg-surface rounded-md p-6 text-center text-sm text-green flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            No se detectaron retiros prematuros.
          </div>
        ) : (
          <div className="space-y-3">
            {alertasData.map((a) => (
              <div key={a.id} className="bg-surface rounded-md p-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red text-[11px] font-medium uppercase tracking-wide">
                        Uso Crítico: {a.porcentajeUso}%
                      </span>
                      <span className="font-mono text-sm font-medium text-foreground">{a.codigoUnico}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {a.marca} {a.medida}
                    </p>
                    <p className="text-xs text-dim mt-1">
                      Retirado el {a.fechaBaja ? new Date(a.fechaBaja).toLocaleDateString("es-CL") : "Fecha desconocida"} de la unidad <span className="font-mono text-foreground">{a.patenteRetiro}</span>
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-dim">Recorrido real</span>
                    <span className="font-mono text-lg font-semibold text-red">{a.kmRealRecorrido.toLocaleString("es-CL")} km</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-dim">Vida útil esperada</span>
                    <span className="font-mono text-lg text-foreground">{a.vidaUtilEstimada.toLocaleString("es-CL")} km</span>
                  </div>
                </div>

                <div className="relative mt-4 h-2 w-full rounded-md bg-surface">
                  <div
                    className="h-full rounded-md bg-red"
                    style={{ width: `${Math.max(a.porcentajeUso, 2)}%` }}
                  />
                  <div className="absolute top-0 bottom-0 right-0 w-px bg-dim" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
