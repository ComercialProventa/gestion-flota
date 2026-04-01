"use client";

import { useQuery } from "@tanstack/react-query";
import type { RankingCPK } from "./actions";
import { obtenerRankingCPK } from "./actions";

export default function NeumaticosDashboard() {
  const { data: ranking, isLoading } = useQuery<RankingCPK[]>({
    queryKey: ["ranking_cpk"],
    queryFn: obtenerRankingCPK,
    staleTime: 1000 * 60 * 10,
  });

  const rankingData = ranking || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-dim">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4"></div>
        <p className="text-sm font-medium animate-pulse">Analizando datos de neumáticos...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[11px] font-medium text-dim uppercase tracking-wide mb-3">Ranking de Rentabilidad (Costo por Kilómetro)</h2>
        <p className="text-xs text-muted">
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
                        <span className="text-xs text-dim font-mono w-5 text-center">{i + 1}</span>
                        <div>
                          <p className="font-medium text-foreground">{r.marca}</p>
                          <p className="text-xs text-dim">{r.medida} · {r.muestras} muestra{r.muestras !== 1 ? "s" : ""}</p>
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
    </div>
  );
}
