"use server";

import { createClient } from "@/utils/supabase/server";

// ─── TIPOS ──────────────────────────────────────────────────

export type RendimientoSemanal = {
  semana: string; // 'YYYY-WNN'
  kmRecorridos: number;
  litrosTotales: number;
  rendimiento: number; // km/L
};

export type UnidadRendimiento = {
  busId: string;
  patente: string;
  marca: string;
  modelo: string;
  ano: number;
  promedioHistorico: number;
  rendimientoActual: number;
  variacionPct: number; // porcentaje de variación vs promedio
  enAlerta: boolean;
  semanas: RendimientoSemanal[];
};

export type ComparativaGemela = {
  grupo: string; // 'Mercedes-Benz O-500 2022'
  unidades: {
    busId: string;
    patente: string;
    promedioKmL: number;
    totalKm: number;
    totalLitros: number;
  }[];
  diferenciaMaxPct: number;
  enAlerta: boolean;
};

export type AlertaEstanque = {
  id: string;
  busId: string;
  patente: string;
  capacidadEstanque: number;
  litrosIntentados: number;
  excedentePct: number;
  fecha: string;
  titulo: string;
};

// ─── RENDIMIENTO SEMANAL POR UNIDAD ─────────────────────────

/**
 * Calcula el rendimiento semanal (Km/L) de cada unidad,
 * detectando caídas >30% vs promedio histórico.
 */
export async function obtenerRendimientoFlota(): Promise<UnidadRendimiento[]> {
  const supabase = await createClient();

  // 1. Obtener todos los buses
  const { data: buses } = await supabase
    .from("buses")
    .select("id, patente, marca, modelo, ano")
    .order("patente");

  if (!buses || buses.length === 0) return [];

  // 2. Obtener todos los registros de combustible ordenados
  const { data: registros } = await supabase
    .from("registros_combustible")
    .select("bus_id, fecha, kilometraje, litros_cargados")
    .order("fecha", { ascending: true });

  if (!registros || registros.length === 0) return [];

  const resultado: UnidadRendimiento[] = [];

  for (const bus of buses) {
    const regs = registros.filter((r) => r.bus_id === bus.id);
    if (regs.length < 2) continue; // Necesitamos al menos 2 registros para calcular

    // Agrupar por semana ISO
    const porSemana = new Map<string, { km: number; litros: number }>();

    for (let i = 1; i < regs.length; i++) {
      const kmRec = regs[i].kilometraje - regs[i - 1].kilometraje;
      const litros = regs[i].litros_cargados;
      if (kmRec <= 0 || litros <= 0) continue;

      const fecha = new Date(regs[i].fecha);
      const semana = getSemanaISO(fecha);

      const entry = porSemana.get(semana) || { km: 0, litros: 0 };
      entry.km += kmRec;
      entry.litros += litros;
      porSemana.set(semana, entry);
    }

    if (porSemana.size === 0) continue;

    const semanas: RendimientoSemanal[] = [];
    let totalKm = 0;
    let totalLitros = 0;

    for (const [semana, datos] of porSemana.entries()) {
      const rend = datos.litros > 0 ? datos.km / datos.litros : 0;
      semanas.push({
        semana,
        kmRecorridos: datos.km,
        litrosTotales: datos.litros,
        rendimiento: Math.round(rend * 100) / 100,
      });
      totalKm += datos.km;
      totalLitros += datos.litros;
    }

    // Ordenar cronológicamente
    semanas.sort((a, b) => a.semana.localeCompare(b.semana));

    const promedioHistorico = totalLitros > 0
      ? Math.round((totalKm / totalLitros) * 100) / 100
      : 0;

    const ultimaSemana = semanas[semanas.length - 1];
    const rendimientoActual = ultimaSemana.rendimiento;

    const variacionPct = promedioHistorico > 0
      ? Math.round(((rendimientoActual - promedioHistorico) / promedioHistorico) * 100)
      : 0;

    resultado.push({
      busId: bus.id,
      patente: bus.patente,
      marca: bus.marca,
      modelo: bus.modelo,
      ano: bus.ano,
      promedioHistorico,
      rendimientoActual,
      variacionPct,
      enAlerta: variacionPct < -30, // >30% de caída → alerta
      semanas,
    });
  }

  // Ordenar: alertas primero
  resultado.sort((a, b) => {
    if (a.enAlerta && !b.enAlerta) return -1;
    if (!a.enAlerta && b.enAlerta) return 1;
    return a.patente.localeCompare(b.patente);
  });

  return resultado;
}

// ─── COMPARATIVA DE UNIDADES GEMELAS ────────────────────────

/**
 * Agrupa unidades de misma marca+modelo+año y compara rendimiento.
 * Alerta si diferencia >30%.
 */
export async function obtenerComparativaGemelas(): Promise<ComparativaGemela[]> {
  const supabase = await createClient();

  const { data: buses } = await supabase
    .from("buses")
    .select("id, patente, marca, modelo, ano")
    .order("marca");

  if (!buses) return [];

  const { data: registros } = await supabase
    .from("registros_combustible")
    .select("bus_id, kilometraje, litros_cargados, fecha")
    .order("fecha", { ascending: true });

  if (!registros) return [];

  // Calcular totales por bus
  const totalesPorBus = new Map<string, { totalKm: number; totalLitros: number }>();

  for (const bus of buses) {
    const regs = registros.filter((r) => r.bus_id === bus.id);
    let totalKm = 0;
    let totalLitros = 0;

    for (let i = 1; i < regs.length; i++) {
      const kmRec = regs[i].kilometraje - regs[i - 1].kilometraje;
      if (kmRec > 0) {
        totalKm += kmRec;
        totalLitros += regs[i].litros_cargados;
      }
    }
    totalesPorBus.set(bus.id, { totalKm, totalLitros });
  }

  // Agrupar por marca+modelo+año
  const grupos = new Map<string, typeof buses>();
  for (const bus of buses) {
    const key = `${bus.marca} ${bus.modelo} ${bus.ano}`;
    const list = grupos.get(key) || [];
    list.push(bus);
    grupos.set(key, list);
  }

  const resultado: ComparativaGemela[] = [];

  for (const [grupo, unidades] of grupos.entries()) {
    if (unidades.length < 2) continue; // Solo comparar si hay gemelas

    const items = unidades.map((bus) => {
      const t = totalesPorBus.get(bus.id) || { totalKm: 0, totalLitros: 0 };
      return {
        busId: bus.id,
        patente: bus.patente,
        promedioKmL: t.totalLitros > 0
          ? Math.round((t.totalKm / t.totalLitros) * 100) / 100
          : 0,
        totalKm: t.totalKm,
        totalLitros: Math.round(t.totalLitros * 10) / 10,
      };
    });

    // Calcular diferencia máxima
    const rendimientos = items.map((i) => i.promedioKmL).filter((r) => r > 0);
    let diferenciaMaxPct = 0;
    if (rendimientos.length >= 2) {
      const max = Math.max(...rendimientos);
      const min = Math.min(...rendimientos);
      diferenciaMaxPct = max > 0 ? Math.round(((max - min) / max) * 100) : 0;
    }

    resultado.push({
      grupo,
      unidades: items,
      diferenciaMaxPct,
      enAlerta: diferenciaMaxPct > 30,
    });
  }

  resultado.sort((a, b) => b.diferenciaMaxPct - a.diferenciaMaxPct);
  return resultado;
}

// ─── ALERTAS ESTANQUE FANTASMA ──────────────────────────────

/**
 * Obtiene alertas de intento de carga mayor a la capacidad del estanque.
 */
export async function obtenerAlertasEstanque(): Promise<AlertaEstanque[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("alertas_sistema")
    .select("id, bus_id, titulo, detalle, creado_en, buses(patente)")
    .eq("tipo", "estanque_fantasma")
    .eq("resuelta", false)
    .order("creado_en", { ascending: false })
    .limit(20);

  if (!data) return [];

  return data.map((a: any) => ({
    id: a.id,
    busId: a.bus_id,
    patente: a.buses?.patente || "—",
    capacidadEstanque: 0,
    litrosIntentados: 0,
    excedentePct: 0,
    fecha: a.creado_en,
    titulo: a.titulo,
  }));
}

// ─── HELPER ─────────────────────────────────────────────────

function getSemanaISO(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-S${String(weekNum).padStart(2, "0")}`;
}
