"use server";

import { createClient } from "@/utils/supabase/server";

export type RankingCPK = {
  modeloId: string;
  marca: string;
  medida: string;
  vidaUtilEstimadaKm: number;
  muestras: number;
  precioPromedio: number;
  rendimientoRealKmPromedio: number;
  cpk: number;
  rentabilidad: "buena" | "regular" | "mala";
};

export async function obtenerRankingCPK(): Promise<RankingCPK[]> {
  const supabase = await createClient();

  const { data: neumaticos, error } = await supabase
    .from("neumaticos")
    .select(`
      id,
      precio,
      desgaste_acumulado_km,
      estado,
      modelos_neumaticos (
        id,
        marca,
        medida,
        vida_util_km
      )
    `)
    .eq("estado", "reciclaje")
    .gt("precio", 0)
    .gt("desgaste_acumulado_km", 0);

  if (error || !neumaticos || neumaticos.length === 0) return [];

  const agrupado = new Map<string, any[]>();
  for (const n of neumaticos) {
    const minfo: any = n.modelos_neumaticos;
    if (!minfo) continue;

    const list = agrupado.get(minfo.id) || [];
    list.push(n);
    agrupado.set(minfo.id, list);
  }

  const ranking: RankingCPK[] = [];

  for (const [modeloId, lista] of agrupado.entries()) {
    const minfo = lista[0].modelos_neumaticos;

    let sumPrecio = 0;
    let sumKm = 0;

    for (const n of lista) {
      sumPrecio += n.precio;
      sumKm += n.desgaste_acumulado_km;
    }

    const precioPromedio = Math.round(sumPrecio / lista.length);
    const rendimientoRealKmPromedio = Math.round(sumKm / lista.length);

    const cpk = rendimientoRealKmPromedio > 0
      ? Math.round((precioPromedio / rendimientoRealKmPromedio) * 100) / 100
      : 0;

    // rentabilidad basada en CPK: más bajo = más rentable
    let rentabilidad: "buena" | "regular" | "mala" = "regular";
    if (cpk > 0 && cpk <= 3.0) rentabilidad = "buena";
    else if (cpk > 5.0) rentabilidad = "mala";

    ranking.push({
      modeloId,
      marca: minfo.marca,
      medida: minfo.medida,
      vidaUtilEstimadaKm: minfo.vida_util_km,
      muestras: lista.length,
      precioPromedio,
      rendimientoRealKmPromedio,
      cpk,
      rentabilidad,
    });
  }

  ranking.sort((a, b) => a.cpk - b.cpk);
  return ranking;
}
