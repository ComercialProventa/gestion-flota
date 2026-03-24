"use server";

import { createClient } from "@/utils/supabase/server";

export type AnomaliaMantenimiento = {
  id: string; // ID de alerta
  busId: string;
  patente: string;
  tipoPieza: string;
  titulo: string;
  detalle: string;
  fechaAlerta: string;
};

export type GastoMensual = {
  busId: string;
  patente: string;
  marca: string;
  modelo: string;
  gastoTotal: number;
};

// ─── ANOMALÍAS DE MANTENIMIENTO ──────────────────────────────

/**
 * Obtiene las alertas de tipo "mantenimiento_anomalo" no resueltas.
 */
export async function obtenerAnomaliasMantenimiento(): Promise<AnomaliaMantenimiento[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("alertas_sistema")
    .select(`
      id,
      bus_id,
      titulo,
      detalle,
      creado_en,
      buses ( patente )
    `)
    .eq("tipo", "mantenimiento_anomalo")
    .eq("resuelta", false)
    .order("creado_en", { ascending: false });

  if (error || !data) return [];

  return data.map((d: any) => {
    // Extraer tipoPieza del título (ej "Anomalía: Pastillas de freno (XX1234)")
    const match = d.titulo.match(/Anomalía:\s*(.+?)\s*\(/);
    const tipoPieza = match ? match[1] : "Pieza desconocida";

    return {
      id: d.id,
      busId: d.bus_id,
      patente: d.buses?.patente || "—",
      tipoPieza,
      titulo: d.titulo,
      detalle: d.detalle,
      fechaAlerta: d.creado_en,
    };
  });
}

// ─── GASTO MENSUAL POR UNIDAD ────────────────────────────────

/**
 * Calcula el gasto total en mantenimiento del mes en curso por unidad.
 */
export async function obtenerGastoMensualPorUnidad(): Promise<GastoMensual[]> {
  const supabase = await createClient();

  // 1. Obtener fecha de inicio del mes actual
  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const primerDiaIso = primerDiaMes.toISOString().split("T")[0];

  // 2. Obtener gastos del mes
  const { data: gastos, error: errGastos } = await supabase
    .from("registros_mantenimiento")
    .select("bus_id, costo")
    .gte("fecha", primerDiaIso);

  if (errGastos || !gastos) return [];

  // Acumular
  const acumulado = new Map<string, number>();
  for (const g of gastos) {
    const total = acumulado.get(g.bus_id) || 0;
    acumulado.set(g.bus_id, total + g.costo);
  }

  // 3. Obtener info de buses
  const busIds = Array.from(acumulado.keys());
  if (busIds.length === 0) return [];

  const { data: buses, error: errBuses } = await supabase
    .from("buses")
    .select("id, patente, marca, modelo")
    .in("id", busIds);

  if (errBuses || !buses) return [];

  const resultado: GastoMensual[] = [];
  
  for (const bus of buses) {
    resultado.push({
      busId: bus.id,
      patente: bus.patente,
      marca: bus.marca,
      modelo: bus.modelo,
      gastoTotal: acumulado.get(bus.id) || 0,
    });
  }

  // Ordenar por el que más gasta (el "cacho")
  resultado.sort((a, b) => b.gastoTotal - a.gastoTotal);

  return resultado;
}
