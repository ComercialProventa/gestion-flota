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

export type Problema = {
  busId: string;
  patente: string;
  marca: string;
  modelo: string;
  conductor: string | null;
  tipo: "ineficiencia" | "costo" | "caida";
  titulo: string;
  detalle: string;
  accion: string;
  valor: number;
  referencia: number;
};

export type ConductorRendimiento = {
  conductorId: string;
  nombre: string;
  unidades: string[];
  kmL: number;
  costoPorKm: number | null;
  gastoTotal: number;
  kmTotal: number;
  viajes: number;
};

export type Proyeccion = {
  gastoProyectado: number;
  gastoAnterior: number;
  variacionPct: number;
  costoKmProyectado: number | null;
  diasAnalizados: number;
};

export type DashboardData = {
  ranking: RankingItem[];
  rendimiento: UnidadRendimiento[];
  kpis: KpiResumen;
  proyeccion: Proyeccion;
  problemas: Problema[];
  conductores: ConductorRendimiento[];
  gemelas: ComparativaGemela[];
  alertas: AlertaEstanque[];
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

// ─── DATOS BASE (una sola vez) ──────────────────────────────

type BusInfo = { id: string; patente: string; marca: string; modelo: string; ano: number; tipo: string };
type RegistroComb = { bus_id: string; fecha: string; kilometraje: number; litros_cargados: number; precio_total_pago: number | null };
type Asignacion = { usuario_id: string; bus_id: string; nombre: string };

async function fetchDatosBase(desde?: string, hasta?: string) {
  const supabase = await createClient();

  const [busesRes, registrosRes, asignacionesRes] = await Promise.all([
    supabase.from("buses").select("id, patente, marca, modelo, ano, tipo").order("patente"),
    supabase
      .from("registros_combustible")
      .select("bus_id, fecha, kilometraje, litros_cargados, precio_total_pago")
      .gte("fecha", desde || "1900-01-01")
      .lte("fecha", hasta || "2100-01-01")
      .order("fecha", { ascending: true }),
    supabase.from("asignacion_flota").select("usuario_id, bus_id, usuarios(nombre_completo)"),
  ]);

  const buses: BusInfo[] = (busesRes.data || []).map((b: any) => ({
    id: b.id, patente: b.patente, marca: b.marca, modelo: b.modelo, ano: b.ano, tipo: b.tipo || "bus",
  }));

  const registros: RegistroComb[] = (registrosRes.data || []).map((r: any) => ({
    bus_id: r.bus_id, fecha: r.fecha, kilometraje: r.kilometraje,
    litros_cargados: r.litros_cargados, precio_total_pago: r.precio_total_pago,
  }));

  const asignaciones: Asignacion[] = (asignacionesRes.data || []).map((a: any) => ({
    usuario_id: a.usuario_id, bus_id: a.bus_id, nombre: a.usuarios?.nombre_completo || "",
  }));

  return { buses, registros, asignaciones };
}

// ─── CÁLCULOS INTERNOS (no hacen queries) ───────────────────

function calcularRendimiento(buses: BusInfo[], registros: RegistroComb[]): UnidadRendimiento[] {
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
      tipo: bus.tipo, promedioHistorico, rendimientoActual, variacionPct,
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

function calcularRanking(buses: BusInfo[], registros: RegistroComb[]): RankingItem[] {
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

    items.push({ busId: bus.id, patente: bus.patente, marca: bus.marca, modelo: bus.modelo, tipo: bus.tipo, kmL, costoPorKm, gastoTotal: totalGasto, kmTotal: totalKm, enAlerta: false });
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

function calcularKpis(ranking: RankingItem[], rendimiento: UnidadRendimiento[]): KpiResumen {
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

function calcularGemelas(buses: BusInfo[], registros: RegistroComb[]): ComparativaGemela[] {
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

  const grupos = new Map<string, BusInfo[]>();
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

function calcularProblemas(ranking: RankingItem[], rendimiento: UnidadRendimiento[], asignaciones: Asignacion[]): Problema[] {
  if (ranking.length === 0) return [];

  const conductorPorBus = new Map<string, string>();
  for (const a of asignaciones) {
    if (a.nombre) conductorPorBus.set(a.bus_id, a.nombre);
  }

  const problemas: Problema[] = [];
  const kmLs = ranking.filter(r => r.kmL > 0).map(r => r.kmL);
  const promedioFlota = kmLs.length > 0 ? kmLs.reduce((a, b) => a + b, 0) / kmLs.length : 0;
  const costos = ranking.filter(r => r.costoPorKm !== null).map(r => r.costoPorKm!);
  const costoPromedio = costos.length > 0 ? costos.reduce((a, b) => a + b, 0) / costos.length : 0;

  // 1. Unidad más ineficiente
  const peorKmL = ranking[0];
  if (peorKmL && peorKmL.kmL > 0 && peorKmL.kmL < promedioFlota * 0.75) {
    problemas.push({
      busId: peorKmL.busId, patente: peorKmL.patente, marca: peorKmL.marca, modelo: peorKmL.modelo,
      conductor: conductorPorBus.get(peorKmL.busId) || null,
      tipo: "ineficiencia",
      titulo: `Unidad más ineficiente: ${peorKmL.patente}`,
      detalle: `Rinde ${peorKmL.kmL} Km/L vs promedio flota de ${promedioFlota.toFixed(1)} Km/L (${Math.round(((peorKmL.kmL - promedioFlota) / promedioFlota) * 100)}% bajo el promedio).`,
      accion: conductorPorBus.get(peorKmL.busId)
        ? `Revisar con ${conductorPorBus.get(peorKmL.busId)} las cargas de este periodo.`
        : "Asignar conductor responsable y revisar cargas del periodo.",
      valor: peorKmL.kmL, referencia: promedioFlota,
    });
  }

  // 2. Unidad más cara por km
  const masCara = [...ranking].filter(r => r.costoPorKm !== null).sort((a, b) => (b.costoPorKm || 0) - (a.costoPorKm || 0))[0];
  if (masCara && masCara.costoPorKm && masCara.costoPorKm > costoPromedio * 1.4) {
    problemas.push({
      busId: masCara.busId, patente: masCara.patente, marca: masCara.marca, modelo: masCara.modelo,
      conductor: conductorPorBus.get(masCara.busId) || null,
      tipo: "costo",
      titulo: `Costo más alto: ${masCara.patente}`,
      detalle: `Cuesta $${masCara.costoPorKm.toLocaleString("es-CL")}/km vs promedio de $${Math.round(costoPromedio).toLocaleString("es-CL")}/km.`,
      accion: "Verificar si el precio de combustible en la estación de esta unidad es superior.",
      valor: masCara.costoPorKm, referencia: costoPromedio,
    });
  }

  // 3. Unidad que más empeoró
  const conCaida = rendimiento.filter(r => r.variacionPct < -20).sort((a, b) => a.variacionPct - b.variacionPct)[0];
  if (conCaida) {
    problemas.push({
      busId: conCaida.busId, patente: conCaida.patente, marca: conCaida.marca, modelo: conCaida.modelo,
      conductor: conductorPorBus.get(conCaida.busId) || null,
      tipo: "caida",
      titulo: `Mayor caída: ${conCaida.patente}`,
      detalle: `Cayó ${conCaida.variacionPct}% vs su propio promedio histórico. De ${conCaida.promedioHistorico} a ${conCaida.rendimientoActual} Km/L.`,
      accion: conductorPorBus.get(conCaida.busId)
        ? `Consultar con ${conductorPorBus.get(conCaida.busId)} qué cambió este periodo.`
        : "Revisar mantención mecánica y registros de carga.",
      valor: conCaida.rendimientoActual, referencia: conCaida.promedioHistorico,
    });
  }

  if (problemas.length < 3) {
    const gastoPromedio = ranking.length > 0 ? ranking.reduce((a, r) => a + r.gastoTotal, 0) / ranking.length : 0;
    const masGasta = [...ranking].sort((a, b) => b.gastoTotal - a.gastoTotal)[0];
    if (masGasta && !problemas.find(p => p.busId === masGasta.busId)) {
      problemas.push({
        busId: masGasta.busId, patente: masGasta.patente, marca: masGasta.marca, modelo: masGasta.modelo,
        conductor: conductorPorBus.get(masGasta.busId) || null,
        tipo: "costo",
        titulo: `Mayor gasto: ${masGasta.patente}`,
        detalle: `Gastó $${masGasta.gastoTotal.toLocaleString("es-CL")} este periodo.`,
        accion: "Comparar con unidades del mismo modelo.",
        valor: masGasta.gastoTotal, referencia: gastoPromedio,
      });
    }
  }

  return problemas.slice(0, 3);
}

function calcularConductores(buses: BusInfo[], registros: RegistroComb[], asignaciones: Asignacion[]): ConductorRendimiento[] {
  const porConductor = new Map<string, { id: string; nombre: string; buses: string[] }>();
  for (const a of asignaciones) {
    const entry = porConductor.get(a.usuario_id) || { id: a.usuario_id, nombre: a.nombre, buses: [] as string[] };
    if (!entry.buses.includes(a.bus_id)) entry.buses.push(a.bus_id);
    porConductor.set(a.usuario_id, entry);
  }

  const resultado: ConductorRendimiento[] = [];

  for (const [, cond] of porConductor) {
    const regsDelConductor = registros.filter(r => cond.buses.includes(r.bus_id));
    if (regsDelConductor.length < 2) continue;

    let totalKm = 0; let totalLitros = 0; let totalGasto = 0; let viajes = 0;
    const busesConDatos: string[] = [];

    for (const busId of cond.buses) {
      const regsBus = regsDelConductor.filter(r => r.bus_id === busId);
      if (regsBus.length < 2) continue;
      busesConDatos.push(busId);

      for (let i = 1; i < regsBus.length; i++) {
        const kmRec = regsBus[i].kilometraje - regsBus[i - 1].kilometraje;
        if (kmRec > 0) {
          totalKm += kmRec;
          totalLitros += regsBus[i].litros_cargados;
          totalGasto += regsBus[i].precio_total_pago || 0;
          viajes++;
        }
      }
    }

    if (viajes === 0) continue;

    resultado.push({
      conductorId: cond.id, nombre: cond.nombre, unidades: busesConDatos,
      kmL: totalLitros > 0 ? Math.round((totalKm / totalLitros) * 100) / 100 : 0,
      costoPorKm: totalGasto > 0 && totalKm > 0 ? Math.round(totalGasto / totalKm) : null,
      gastoTotal: totalGasto, kmTotal: totalKm, viajes,
    });
  }

  const kmLs = resultado.filter(r => r.kmL > 0).map(r => r.kmL);
  if (kmLs.length > 0) {
    const promedio = kmLs.reduce((a, b) => a + b, 0) / kmLs.length;
    const umbral = promedio * 0.7;
    resultado.forEach(r => { if (r.kmL > 0 && r.kmL < umbral) r.viajes = -r.viajes; });
  }

  resultado.sort((a, b) => a.kmL - b.kmL);
  return resultado;
}

// ─── API PÚBLICA ────────────────────────────────────────────

export async function obtenerDashboardCombustible(desde?: string, hasta?: string): Promise<DashboardData> {
  const { buses, registros, asignaciones } = await fetchDatosBase(desde, hasta);

  const ranking = calcularRanking(buses, registros);
  const rendimiento = calcularRendimiento(buses, registros);
  const kpis = calcularKpis(ranking, rendimiento);
  const gemelas = calcularGemelas(buses, registros);
  const conductores = calcularConductores(buses, registros, asignaciones);
  const problemas = calcularProblemas(ranking, rendimiento, asignaciones);

  // Proyección
  const diasPeriodo = desde && hasta ? Math.ceil((new Date(hasta).getTime() - new Date(desde).getTime()) / 86400000) + 1 : 0;
  const gastoDiario = diasPeriodo > 0 ? kpis.gastoTotalPeriodo / diasPeriodo : 0;
  const gastoProyectado = Math.round(gastoDiario * 30);
  const kmDiario = diasPeriodo > 0 ? kpis.kmTotalesPeriodo / diasPeriodo : 0;
  const kmProyectado = kmDiario * 30;
  const costoKmProyectado = kmProyectado > 0 ? Math.round(gastoProyectado / kmProyectado) : null;

  // Periodo anterior
  let variacionPct = 0;
  let gastoAnterior = 0;
  if (desde && hasta && diasPeriodo > 0) {
    const d1 = new Date(desde);
    const antHasta = new Date(d1); antHasta.setDate(antHasta.getDate() - 1);
    const antDesde = new Date(antHasta); antDesde.setDate(antDesde.getDate() - diasPeriodo + 1);

    const { registros: regsAnt } = await fetchDatosBase(toISO(antDesde), toISO(antHasta));
    const rankingAnt = calcularRanking(buses, regsAnt);
    gastoAnterior = rankingAnt.reduce((acc, r) => acc + r.gastoTotal, 0);
    variacionPct = gastoAnterior > 0 ? Math.round(((kpis.gastoTotalPeriodo - gastoAnterior) / gastoAnterior) * 100) : 0;
  }

  const proyeccion: Proyeccion = { gastoProyectado, gastoAnterior, variacionPct, costoKmProyectado, diasAnalizados: diasPeriodo };

  // Alertas estanque (query separada, no depende de los datos base)
  const supabase = await createClient();
  const { data: alertasData } = await supabase
    .from("alertas_sistema")
    .select("id, bus_id, titulo, creado_en, buses(patente)")
    .eq("tipo", "estanque_fantasma")
    .eq("resuelta", false)
    .order("creado_en", { ascending: false })
    .limit(20);

  const alertas: AlertaEstanque[] = (alertasData || []).map((a: any) => ({
    id: a.id, busId: a.bus_id, patente: a.buses?.patente || "—",
    capacidadEstanque: 0, litrosIntentados: 0, excedentePct: 0,
    fecha: a.creado_en, titulo: a.titulo,
  }));

  return { ranking, rendimiento, kpis, proyeccion, problemas, conductores, gemelas, alertas };
}

// ─── RESOLVER ALERTA ────────────────────────────────────────

export async function resolverAlerta(alertaId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("alertas_sistema").update({ resuelta: true }).eq("id", alertaId);
  if (error) return { error: error.message };
  revalidatePath("/admin/inteligencia");
  return { success: true };
}
