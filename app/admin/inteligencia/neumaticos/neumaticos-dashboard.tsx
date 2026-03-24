"use client";

import type { RankingCPK, AlertaCambiazo } from "./actions";

/**
 * NeumaticosDashboard — Client Component
 * 1. Ranking de Rentabilidad (CPK) - Mejor vs Peor negocio
 * 2. Alertas de "El Cambiazo" (Robo de neumáticos nuevos)
 */
export default function NeumaticosDashboard({
  ranking,
  alertas,
}: {
  ranking: RankingCPK[];
  alertas: AlertaCambiazo[];
}) {
  return (
    <div className="space-y-8">
      {/* ═══ SECCIÓN 1: RANKING CPK ═══ */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Ranking de Rentabilidad (Costo por Kilómetro)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Basado en el precio de compra y los kilómetros reales recorridos antes del reciclaje.
          </p>
        </div>

        {ranking.length === 0 ? (
          <div className="rounded border border-white/5 bg-[#121214] p-8 text-center text-sm text-slate-500">
            No hay neumáticos reciclados con precio registrado para calcular el CPK.
          </div>
        ) : (
          <div className="rounded border border-white/5 bg-[#121214] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/5 bg-black/40 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Modelo</th>
                    <th className="px-5 py-4 font-semibold text-right">Rend. Medio</th>
                    <th className="px-5 py-4 font-semibold text-right">Precio Prom.</th>
                    <th className="px-5 py-4 font-bold text-sky-400 text-right">CPK ($/Km)</th>
                    <th className="px-5 py-4 font-semibold text-center">Rentabilidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {ranking.map((r, i) => (
                    <tr key={r.modeloId} className="transition-colors hover:bg-white/5/20">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                            i === 0 ? "bg-amber-500 text-amber-950" :
                            i === ranking.length - 1 ? "bg-red-500 text-red-950" :
                            "bg-slate-700 text-slate-300"
                          }`}>
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-white">{r.marca}</p>
                            <p className="text-xs text-slate-400">{r.medida} · {r.muestras} muestra{r.muestras !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right text-slate-300 font-mono">
                        {r.rendimientoRealKmPromedio.toLocaleString("es-CL")} km
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          esperado: {r.vidaUtilEstimadaKm.toLocaleString("es-CL")}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right text-slate-300 font-mono">
                        ${r.precioPromedio.toLocaleString("es-CL")}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-sky-400">
                        ${r.cpk.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          r.rentabilidad === "buena" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" :
                          r.rentabilidad === "mala" ? "border-red-500/30 bg-red-500/10 text-red-400" :
                          "border-amber-500/30 bg-amber-500/10 text-amber-400"
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

      {/* ═══ SECCIÓN 2: ALERTA EL CAMBIAZO ═══ */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Auditoría: "El Cambiazo"
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Neumáticos enviados a reciclaje con <span className="text-red-400 font-bold">menos del 20%</span> de su vida útil esperada. Posible venta en ruta.
          </p>
        </div>

        {alertas.length === 0 ? (
          <div className="rounded border border-emerald-500/20 bg-emerald-500/5 p-6 text-center text-sm text-emerald-400 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            No se detectaron retiros prematuros.
          </div>
        ) : (
          <div className="space-y-3">
            {alertas.map((a) => (
              <div key={a.id} className="rounded border border-red-500/30 bg-red-500/5 p-5 relative overflow-hidden">
                {/* Decorative alert bg */}
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
                        Uso Crítico: {a.porcentajeUso}%
                      </span>
                      <span className="font-mono text-sm font-bold text-white">{a.codigoUnico}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      {a.marca} {a.medida}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Retirado el {a.fechaBaja ? new Date(a.fechaBaja).toLocaleDateString("es-CL") : "Fecha desconocida"} de la unidad <span className="font-mono text-slate-300">{a.patenteRetiro}</span>
                    </p>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500">Recorrido real</span>
                    <span className="font-mono text-lg font-bold text-red-400">{a.kmRealRecorrido.toLocaleString("es-CL")} km</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500">Vida útil esperada</span>
                    <span className="font-mono text-lg text-slate-300">{a.vidaUtilEstimada.toLocaleString("es-CL")} km</span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="relative mt-4 h-2 w-full rounded-full bg-slate-800 border border-white/10">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{ width: `${Math.max(a.porcentajeUso, 2)}%` }}
                  />
                  {/* Marcador 100% */}
                  <div className="absolute top-0 bottom-0 right-0 w-px bg-slate-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
