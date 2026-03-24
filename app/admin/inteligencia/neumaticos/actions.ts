"use server";

import { createClient } from "@/utils/supabase/server";

export type RankingCPK = {
  modeloId: string;
  marca: string;
  medida: string;
  vidaUtilEstimadaKm: number;
  muestras: number;           // Cantidad de neumáticos reciclados de este modelo
  precioPromedio: number;
  rendimientoRealKmPromedio: number;
  cpk: number;                // Costo Por Kilómetro ($/Km)
  rentabilidad: "buena" | "regular" | "mala";
};

export type AlertaCambiazo = {
  id: string;
  neumaticoId: string;
  codigoUnico: string;
  marca: string;
  medida: string;
  vidaUtilEstimada: number;
  kmRealRecorrido: number;
  porcentajeUso: number;
  fechaBaja: string;
  patenteRetiro: string;     // Vehículo del que se sacó
  usuarioId: string | null;
};

// ─── RANKING CPK (COSTO POR KILÓMETRO) ───────────────────────

/**
 * Calcula el Costo por Kilómetro (CPK) real por modelo de neumático,
 * basándose solo en neumáticos que ya cumplieron un ciclo (estado = 'reciclaje')
 * o que tengan al menos precio y km registrado actual.
 *
 * Para simplificar el MVP, tomaremos los neumáticos en cualquier estado
 * que tengan precio > 0 y desgaste_acumulado_km > 0.
 */
export async function obtenerRankingCPK(): Promise<RankingCPK[]> {
  const supabase = await createClient();

  // Traer todos los neumáticos con sus modelos
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
    .eq("estado", "reciclaje") // Solo medimos rentabilidad real en neumáticos dados de baja
    .gt("precio", 0)           // Que tengan precio de compra
    .gt("desgaste_acumulado_km", 0); // Que se hayan usado algo

  if (error || !neumaticos || neumaticos.length === 0) return [];

  // Agrupar por modelo_id
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
    
    // CPK = Precio / Km Real
    const cpk = rendimientoRealKmPromedio > 0
      ? Math.round((precioPromedio / rendimientoRealKmPromedio) * 100) / 100
      : 0;

    // Calcular rentabilidad (referencia abstracta)
    // Supongamos que pagamos un precio base y esperamos X km.
    // Vida util esperada = minfo.vida_util_km
    // Si duró < 70% de lo esperado, es 'mala'
    const ratioRealVsEsperado = rendimientoRealKmPromedio / minfo.vida_util_km;
    let rentabilidad: "buena" | "regular" | "mala" = "regular";
    
    if (ratioRealVsEsperado >= 0.95) rentabilidad = "buena";
    else if (ratioRealVsEsperado <= 0.70) rentabilidad = "mala";

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

  // Ordenar por mejor CPK (el CPK más bajo es mejor)
  ranking.sort((a, b) => a.cpk - b.cpk);
  return ranking;
}

// ─── ALERTA: EL CAMBIAZO ──────────────────────────────────────

/**
 * Busca neumáticos que fueron enviados a 'reciclaje'
 * pero no cumplieron ni el 20% de su vida útil esperada.
 */
export async function obtenerAlertasCambiazo(): Promise<AlertaCambiazo[]> {
  const supabase = await createClient();

  // Consultar neumáticos reciclados con poco desgaste
  const { data: neumaticos, error } = await supabase
    .from("neumaticos")
    .select(`
      id,
      codigo_unico,
      desgaste_acumulado_km,
      modelos_neumaticos (
        marca,
        medida,
        vida_util_km
      )
    `)
    .eq("estado", "reciclaje")
    .gt("desgaste_acumulado_km", 0);

  if (error || !neumaticos || neumaticos.length === 0) return [];

  const sospechosos: any[] = [];

  for (const n of neumaticos) {
    const minfo: any = n.modelos_neumaticos;
    if (!minfo) continue;

    const vidaUtilEsperada = minfo.vida_util_km;
    if (vidaUtilEsperada <= 0) continue;

    const kmReal = n.desgaste_acumulado_km;
    const porcentajeUso = kmReal / vidaUtilEsperada;

    // ALERTA ROJA: Se dio de baja antes de cumplir el 20% de su vida útil
    if (porcentajeUso < 0.20) {
      sospechosos.push({
        n,
        porcentajeUso: Math.round(porcentajeUso * 100),
      });
    }
  }

  if (sospechosos.length === 0) return [];

  // Buscar el movimiento de baja para saber de qué bus salió y cuándo
  // Tomamos los IDs de neumáticos sospechosos
  const idsSospechosos = sospechosos.map(s => s.n.id);

  const { data: movimientos } = await supabase
    .from("movimientos_neumaticos")
    .select(`
      id,
      neumatico_id,
      fecha_movimiento,
      usuario_id,
      buses ( patente )
    `)
    .in("neumatico_id", idsSospechosos)
    .eq("accion", "reciclaje")
    .order("fecha_movimiento", { ascending: false });

  const alertas: AlertaCambiazo[] = [];

  for (const s of sospechosos) {
    const mov = movimientos?.find(m => m.neumatico_id === s.n.id);
    const minfo = s.n.modelos_neumaticos;
    
    alertas.push({
      id: mov ? mov.id : s.n.id,
      neumaticoId: s.n.id,
      codigoUnico: s.n.codigo_unico,
      marca: minfo.marca,
      medida: minfo.medida,
      vidaUtilEstimada: minfo.vida_util_km,
      kmRealRecorrido: s.n.desgaste_acumulado_km,
      porcentajeUso: s.porcentajeUso,
      fechaBaja: mov ? mov.fecha_movimiento : "",
      patenteRetiro: mov && mov.buses ? (mov.buses as any).patente : "Desconocido",
      usuarioId: mov ? mov.usuario_id : null,
    });
  }

  // Ordenar por porcentaje de uso ascendente (los más descarados primero)
  alertas.sort((a, b) => a.porcentajeUso - b.porcentajeUso);

  return alertas;
}
