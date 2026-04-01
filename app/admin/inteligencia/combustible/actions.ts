"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// ─── TIPOS ──────────────────────────────────────────────────

export type RendimientoSemanal = {
  semana: string;
  kmRecorridos: number;
  litrosTotales: number;
  rendimiento: number;
};

export type UnidadRendimiento = {
  busId: string;
  patente: string;
  marca: string;
  modelo: string;
  ano: number;
  tipo: string;
  promedioHistorico: number;
  rendimientoActual: number;
  variacionPct: number;
  enAlerta: boolean;
  semanas: RendimientoSemanal[];
  costoPorKm: number | null;
  gastoTotal: number;
  kmTotal: number;
  litrosTotal: number;
};

export type RankingItem = {
  busId: string;
  patente: string;
  marca: string;
  modelo: string;
  tipo: string;
  kmL: number;
  costoPorKm: number | null;
  gastoTotal: number;
  kmTotal: number;
  enAlerta: boolean;
};

export type ComparativaGemela = {
  grupo: string;
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

export type KpiResumen = {
  rendimientoPromedioFlota: number;
  costoPorKmPromedio: number | null;
  gastoTotalPeriodo: number;
  kmTotalesPeriodo: number;
  unidadesConAlerta: number;
  totalUnidades: number;
};

// ─── HELPERS ────────────────────────────────────────────────

function getSemanaISO(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-S${String(weekNum).padStart(2, "0")}`;
}

function toISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

// Devuelve el periodo anterior de igual duración
function periodoAnterior(desde: string, hasta: string): { desde: string; hasta: string } {
  const d1 = new Date(desde);
  const d2 = new Date(hasta);
  const dias = Math.ceil((d2.getTime() - d1.getTime()) / 86400000);
  const anteriorHasta = new Date(d1);
  anteriorHasta.setDate(anteriorHasta.getDate() - 1);
  const anteriorDesde = new Date(anteriorHasta);
  anteriorDesde.setDate(anteriorDesde.getDate() - dias);
  return { desde: toISO(anteriorDesde), hasta: toISO(anteriorHasta) };
}

// ─── QUERY BASE ─────────────────────────────────────────────

async function queryRegistros(desde?: string, hasta?: string) {
  const supabase = await createClient();
  let q = supabase
    .from("registros_combustible")
    .select("bus_id, fecha, kilometraje, litros_cargados, precio_total_pago")
    .order("fecha", { ascending: true });
  if (desde) q = q.gte("fecha", desde);
  if (hasta) q = q.lte("fecha", hasta);
  return q;
}

// ─── RENDIMIENTO SEMANAL ────────────────────────────────────

export async function obtenerRendimientoFlota(desde?: string, hasta?: string): Promise<UnidadRendimiento[]> {
  const supabase = await createClient();

  const { data: buses } = await supabase
    .from("buses")
    .select("id, patente, marca, modelo, ano, tipo")
    .order("patente");

  if (!buses || buses.length === 0) return [];

  const { data: registros } = await queryRegistros(desde, hasta);
  if (!registros || registros.length === 0) return [];

  const resultado: UnidadRendimiento[] = [];

  for (const bus of buses) {
    const regs = registros.filter((r) => r.bus_id === bus.id);
    if (regs.length < 2) continue;

    const porSemana = new Map<string, { km: number; litros: number; gasto: number }>();

    for (let i = 1; i < regs.length; i++) {
      const kmRec = regs[i].kilometraje - regs[i - 1].kilometraje;
      const litros = regs[i].litros_cargados;
      const precio = regs[i].precio_total_pago || 0;
      if (kmRec <= 0 || litros <= 0) continue;

      const semana = getSemanaISO(new Date(regs[i].fecha));
      const entry = porSemana.get(semana) || { km: 0, litros: 0, gasto: 0 };
      entry.km += kmRec;
      entry.litros += litros;
      entry.gasto += precio;
      porSemana.set(semana, entry);
    }

    if (porSemana.size === 0) continue;

    const semanas: RendimientoSemanal[] = [];
    let totalKm = 0; let totalLitros = 0; let totalGasto = 0;

    for (const [semana, datos] of porSemana.entries()) {
      const rend = datos.litros > 0 ? datos.km / datos.litros : 0;
      semanas.push({ semana, kmRecorridos: datos.km, litrosTotales: datos.litros, rendimiento: Math.round(rend * 100) / 100 });
      totalKm += datos.km;
      totalLitros += datos.litros;
      totalGasto += datos.gasto;
    }

    semanas.sort((a, b) => a.semana.localeCompare(b.semana));

    const promedioHistorico = totalLitros > 0 ? Math.round((totalKm / totalLitros) * 100) / 100 : 0;
    const ultimaSemana = semanas[semanas.length - 1];
    const rendimientoActual = ultimaSemana.rendimiento;
    const variacionPct = promedioHistorico > 0 ? Math.round(((rendimientoActual - promedioHistorico) / promedioHistorico) * 100) : 0;
    const costoPorKm = totalGasto > 0 && totalKm > 0 ? Math.round(totalGasto / totalKm) : null;

    resultado.push({
      busId: bus.id, patente: bus.patente, marca: bus.marca, modelo: bus.modelo, ano: bus.ano,
      tipo: bus.tipo || "bus", promedioHistorico, rendimientoActual, variacionPct,
      enAlerta: variacionPct < -30, semanas, costoPorKm, gastoTotal: totalGasto,
      kmTotal: totalKm, litrosTotal: Math.round(totalLitros),
    });
  }

  resultado.sort((a, b) => {
    if (a.enAlerta && !b.enAlerta) return -1;
    if (!a.enAlerta && b.enAlerta) return 1;
    return a.patente.localeCompare(b.patente);
  });

  return resultado;
}

// ─── RANKING ────────────────────────────────────────────────

export async function obtenerRanking(desde?: string, hasta?: string): Promise<RankingItem[]> {
  const supabase = await createClient();

  const { data: buses } = await supabase
    .from("buses")
    .select("id, patente, marca, modelo, tipo")
    .order("patente");

  if (!buses) return [];

  const { data: registros } = await queryRegistros(desde, hasta);
  if (!registros) return [];

  const items: RankingItem[] = [];

  for (const bus of buses) {
    const regs = registros.filter((r) => r.bus_id === bus.id);
    if (regs.length < 2) continue;

    let totalKm = 0; let totalLitros = 0; let totalGasto = 0;
    for (let i = 1; i < regs.length; i++) {
      const kmRec = regs[i].kilometraje - regs[i - 1].kilometraje;
      if (kmRec > 0) {
        totalKm += kmRec;
        totalLitros += regs[i].litros_cargados;
        totalGasto += regs[i].precio_total_pago || 0;
      }
    }

    const kmL = totalLitros > 0 ? Math.round((totalKm / totalLitros) * 100) / 100 : 0;
    const costoPorKm = totalGasto > 0 && totalKm > 0 ? Math.round(totalGasto / totalKm) : null;

    items.push({ busId: bus.id, patente: bus.patente, marca: bus.marca, modelo: bus.modelo, tipo: bus.tipo || "bus", kmL, costoPorKm, gastoTotal: totalGasto, kmTotal: totalKm, enAlerta: false });
  }

  const promedios = items.filter(i => i.kmL > 0).map(i => i.kmL);
  if (promedios.length > 0) {
    const promFlota = promedios.reduce((a, b) => a + b, 0) / promedios.length;
    const umbral = promFlota * 0.7;
    items.forEach(i => { if (i.kmL > 0 && i.kmL < umbral) i.enAlerta = true; });
  }

  items.sort((a, b) => a.kmL - b.kmL);
  return items;
}

// ─── KPI RESUMEN ────────────────────────────────────────────

export async function obtenerKpis(desde?: string, hasta?: string): Promise<KpiResumen> {
  const ranking = await obtenerRanking(desde, hasta);
  const rendimiento = await obtenerRendimientoFlota(desde, hasta);

  if (ranking.length === 0) {
    return { rendimientoPromedioFlota: 0, costoPorKmPromedio: null, gastoTotalPeriodo: 0, kmTotalesPeriodo: 0, unidadesConAlerta: 0, totalUnidades: 0 };
  }

  const kmLs = ranking.filter(r => r.kmL > 0).map(r => r.kmL);
  const costos = ranking.filter(r => r.costoPorKm !== null).map(r => r.costoPorKm!);

  return {
    rendimientoPromedioFlota: kmLs.length > 0 ? Math.round((kmLs.reduce((a, b) => a + b, 0) / kmLs.length) * 100) / 100 : 0,
    costoPorKmPromedio: costos.length > 0 ? Math.round(costos.reduce((a, b) => a + b, 0) / costos.length) : null,
    gastoTotalPeriodo: ranking.reduce((acc, r) => acc + r.gastoTotal, 0),
    kmTotalesPeriodo: ranking.reduce((acc, r) => acc + r.kmTotal, 0),
    unidadesConAlerta: rendimiento.filter(r => r.enAlerta).length,
    totalUnidades: ranking.length,
  };
}

// ─── GEMELAS ────────────────────────────────────────────────

export async function obtenerComparativaGemelas(desde?: string, hasta?: string): Promise<ComparativaGemela[]> {
  const supabase = await createClient();

  const { data: buses } = await supabase.from("buses").select("id, patente, marca, modelo, ano").order("marca");
  if (!buses) return [];

  const { data: registros } = await queryRegistros(desde, hasta);
  if (!registros) return [];

  const totalesPorBus = new Map<string, { totalKm: number; totalLitros: number }>();
  for (const bus of buses) {
    const regs = registros.filter((r) => r.bus_id === bus.id);
    let totalKm = 0; let totalLitros = 0;
    for (let i = 1; i < regs.length; i++) {
      const kmRec = regs[i].kilometraje - regs[i - 1].kilometraje;
      if (kmRec > 0) { totalKm += kmRec; totalLitros += regs[i].litros_cargados; }
    }
    totalesPorBus.set(bus.id, { totalKm, totalLitros });
  }

  const grupos = new Map<string, typeof buses>();
  for (const bus of buses) {
    const key = `${bus.marca} ${bus.modelo} ${bus.ano}`;
    const list = grupos.get(key) || [];
    list.push(bus);
    grupos.set(key, list);
  }

  const resultado: ComparativaGemela[] = [];
  for (const [grupo, unidades] of grupos.entries()) {
    if (unidades.length < 2) continue;
    const items = unidades.map((bus) => {
      const t = totalesPorBus.get(bus.id) || { totalKm: 0, totalLitros: 0 };
      return { busId: bus.id, patente: bus.patente, promedioKmL: t.totalLitros > 0 ? Math.round((t.totalKm / t.totalLitros) * 100) / 100 : 0, totalKm: t.totalKm, totalLitros: Math.round(t.totalLitros * 10) / 10 };
    });
    const rendimientos = items.map((i) => i.promedioKmL).filter((r) => r > 0);
    let diferenciaMaxPct = 0;
    if (rendimientos.length >= 2) {
      const max = Math.max(...rendimientos); const min = Math.min(...rendimientos);
      diferenciaMaxPct = max > 0 ? Math.round(((max - min) / max) * 100) : 0;
    }
    resultado.push({ grupo, unidades: items, diferenciaMaxPct, enAlerta: diferenciaMaxPct > 30 });
  }

  resultado.sort((a, b) => b.diferenciaMaxPct - a.diferenciaMaxPct);
  return resultado;
}

// ─── ALERTAS ESTANQUE FANTASMA ──────────────────────────────

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
    id: a.id, busId: a.bus_id, patente: a.buses?.patente || "—",
    capacidadEstanque: 0, litrosIntentados: 0, excedentePct: 0,
    fecha: a.creado_en, titulo: a.titulo,
  }));
}

// ─── RESOLVER ALERTA ────────────────────────────────────────

export async function resolverAlerta(alertaId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("alertas_sistema").update({ resuelta: true }).eq("id", alertaId);
  if (error) return { error: error.message };
  revalidatePath("/admin/inteligencia/combustible");
  return { success: true };
}
