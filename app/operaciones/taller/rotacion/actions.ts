"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

/**
 * Tipo de neumático con los datos necesarios para la UI del chasis.
 */
export type Neumatico = {
  id: string;
  codigo_unico: string;
  posicion_actual: string | null;
  estado: string | null;
  desgaste_acumulado_km: number | null;
};

/**
 * Obtiene los neumáticos instalados en un bus específico.
 *
 * Filtra por bus_actual_id y estado 'instalado', retornando solo
 * los campos necesarios para renderizar el chasis interactivo.
 */
export async function obtenerNeumaticosBus(busId: string): Promise<Neumatico[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("neumaticos")
    .select("id, codigo_unico, posicion_actual, estado, desgaste_acumulado_km")
    .eq("bus_actual_id", busId)
    .eq("estado", "instalado");

  if (error) {
    console.error("Error al obtener neumáticos:", error.message);
    return [];
  }

  return data || [];
}

/**
 * Obtener el último kilometraje registrado del bus (para validación del modal).
 * Busca en registros_combustible el último km registrado.
 */
export async function obtenerUltimoKmBus(busId: string): Promise<number> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("registros_combustible")
    .select("kilometraje")
    .eq("bus_id", busId)
    .order("fecha", { ascending: false })
    .order("hora", { ascending: false })
    .limit(1)
    .single();

  return data?.kilometraje || 0;
}

/**
 * Server Action para registrar un movimiento de neumático (rotación o reciclaje).
 *
 * Flujo para ROTACIÓN:
 * 1. Si hay neumático en destino → intercambiar posiciones de ambos
 * 2. Si destino está vacío → mover el neumático a la nueva posición
 * 3. Insertar registro(s) en movimientos_neumaticos
 *
 * Flujo para RECICLAJE (baja):
 * 1. Cambiar estado del neumático a 'reciclaje'
 * 2. Limpiar bus_actual_id y posicion_actual
 * 3. Insertar registro en movimientos_neumaticos
 */
export async function registrarMovimientoNeumatico(params: {
  busId: string;
  neumaticoId: string;
  accion: string;
  posicionOrigen: string;
  posicionDestino: string | null;
  kilometrajeMomento: number;
  neumaticoDestinoId?: string | null;
}) {
  const supabase = await createClient();

  // Obtener usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No estás autenticado" };
  }

  // Validar kilometraje
  const ultimoKm = await obtenerUltimoKmBus(params.busId);
  if (params.kilometrajeMomento < ultimoKm) {
    return {
      error: `El kilometraje (${params.kilometrajeMomento}) no puede ser menor al último registrado (${ultimoKm})`,
    };
  }

  try {
    if (params.accion === "reciclaje") {
      // ─── FLUJO DE RECICLAJE ───────────────────────────────
      // 1. Actualizar neumático: estado → reciclaje, limpiar bus y posición
      const { error: updateError } = await supabase
        .from("neumaticos")
        .update({
          estado: "reciclaje",
          bus_actual_id: null,
          posicion_actual: null,
        })
        .eq("id", params.neumaticoId);

      if (updateError) {
        return { error: `Error al dar de baja: ${updateError.message}` };
      }

      // 2. Insertar registro histórico
      const { error: histError } = await supabase
        .from("movimientos_neumaticos")
        .insert({
          neumatico_id: params.neumaticoId,
          bus_id: params.busId,
          usuario_id: user.id,
          accion: "reciclaje",
          posicion_origen: params.posicionOrigen,
          posicion_destino: null,
          kilometraje_bus_momento: params.kilometrajeMomento,
        });

      if (histError) {
        return { error: `Error al registrar historial: ${histError.message}` };
      }
    } else {
      // ─── FLUJO DE ROTACIÓN ────────────────────────────────
      // 1. Mover neumático A a posición destino
      const { error: moveA } = await supabase
        .from("neumaticos")
        .update({ posicion_actual: params.posicionDestino })
        .eq("id", params.neumaticoId);

      if (moveA) {
        return { error: `Error al mover neumático: ${moveA.message}` };
      }

      // 2. Si hay neumático en destino, moverlo a posición de origen (intercambio)
      if (params.neumaticoDestinoId) {
        const { error: moveB } = await supabase
          .from("neumaticos")
          .update({ posicion_actual: params.posicionOrigen })
          .eq("id", params.neumaticoDestinoId);

        if (moveB) {
          return { error: `Error al intercambiar neumático: ${moveB.message}` };
        }

        // Historial para el neumático B (el que estaba en destino)
        await supabase.from("movimientos_neumaticos").insert({
          neumatico_id: params.neumaticoDestinoId,
          bus_id: params.busId,
          usuario_id: user.id,
          accion: "rotacion",
          posicion_origen: params.posicionDestino,
          posicion_destino: params.posicionOrigen,
          kilometraje_bus_momento: params.kilometrajeMomento,
        });
      }

      // 3. Historial para el neumático A (el seleccionado)
      const { error: histError } = await supabase
        .from("movimientos_neumaticos")
        .insert({
          neumatico_id: params.neumaticoId,
          bus_id: params.busId,
          usuario_id: user.id,
          accion: "rotacion",
          posicion_origen: params.posicionOrigen,
          posicion_destino: params.posicionDestino,
          kilometraje_bus_momento: params.kilometrajeMomento,
        });

      if (histError) {
        return { error: `Error al registrar historial: ${histError.message}` };
      }
    }
  } catch (err) {
    return { error: `Error inesperado: ${String(err)}` };
  }

  revalidatePath("/operaciones/taller/rotacion");

  return {
    success: true,
    mensaje:
      params.accion === "reciclaje"
        ? "Neumático enviado a reciclaje exitosamente"
        : "Rotación de neumáticos realizada exitosamente",
  };
}

/**
 * Tipo de neumático disponible en inventario, incluye info del modelo.
 */
export type NeumaticoInventario = {
  id: string;
  codigo_unico: string;
  modelo_marca: string;
  modelo_medida: string;
};

/**
 * Obtiene todos los neumáticos con estado 'inventario' (disponibles para instalar).
 *
 * Hace un join con modelos_neumaticos para traer marca y medida
 * que se mostrarán en el select del modal de instalación.
 */
export async function obtenerNeumaticosInventario(): Promise<NeumaticoInventario[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("neumaticos")
    .select("id, codigo_unico, modelos_neumaticos(marca, medida)")
    .eq("estado", "inventario")
    .order("codigo_unico", { ascending: true });

  if (error) {
    console.error("Error al obtener inventario:", error.message);
    return [];
  }

  // Transformar la respuesta para aplanar los datos del modelo
  return (data || []).map((n: any) => ({
    id: n.id,
    codigo_unico: n.codigo_unico,
    modelo_marca: n.modelos_neumaticos?.marca || "Sin marca",
    modelo_medida: n.modelos_neumaticos?.medida || "Sin medida",
  }));
}

/**
 * Server Action — Instalar un neumático desde inventario a un slot vacío del bus.
 *
 * Flujo:
 * 1. Valida que el neumático exista y esté en estado 'inventario'
 * 2. Valida el kilometraje contra el último registrado
 * 3. UPDATE neumaticos: estado→instalado, bus_actual_id, posicion_actual
 * 4. INSERT movimientos_neumaticos: acción 'instalacion'
 * 5. revalidatePath para actualizar la UI
 */
export async function instalarNeumaticoDesdeInventario(params: {
  neumaticoId: string;
  busId: string;
  posicion: string;
  kilometrajeBus: number;
}) {
  const supabase = await createClient();

  // Autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No estás autenticado" };
  }

  // Validar kilometraje
  const ultimoKm = await obtenerUltimoKmBus(params.busId);
  if (params.kilometrajeBus < ultimoKm) {
    return {
      error: `El kilometraje (${params.kilometrajeBus}) no puede ser menor al último registrado (${ultimoKm})`,
    };
  }

  try {
    // 1. Verificar que el neumático está disponible en inventario
    const { data: neumatico, error: fetchError } = await supabase
      .from("neumaticos")
      .select("id, estado")
      .eq("id", params.neumaticoId)
      .single();

    if (fetchError || !neumatico) {
      return { error: "Neumático no encontrado" };
    }

    if (neumatico.estado !== "inventario") {
      return { error: "Este neumático ya no está disponible en inventario" };
    }

    // 2. UPDATE: Cambiar estado a instalado y asignar bus + posición
    const { error: updateError } = await supabase
      .from("neumaticos")
      .update({
        estado: "instalado",
        bus_actual_id: params.busId,
        posicion_actual: params.posicion,
        desgaste_acumulado_km: 0, // Punto cero de desgaste en este bus
      })
      .eq("id", params.neumaticoId);

    if (updateError) {
      return { error: `Error al instalar: ${updateError.message}` };
    }

    // 3. INSERT: Registrar movimiento histórico
    const { error: histError } = await supabase
      .from("movimientos_neumaticos")
      .insert({
        neumatico_id: params.neumaticoId,
        bus_id: params.busId,
        usuario_id: user.id,
        accion: "instalacion",
        posicion_origen: null, // Venía del inventario, sin posición previa
        posicion_destino: params.posicion,
        kilometraje_bus_momento: params.kilometrajeBus,
      });

    if (histError) {
      return { error: `Error al registrar historial: ${histError.message}` };
    }
  } catch (err) {
    return { error: `Error inesperado: ${String(err)}` };
  }

  revalidatePath("/operaciones/taller/rotacion");

  return {
    success: true,
    mensaje: "Neumático instalado exitosamente",
  };
}

/**
 * Tipo de modelo de neumático para el selector de Compra Directa.
 */
export type ModeloNeumatico = {
  id: string;
  marca: string;
  medida: string;
  vida_util_km: number;
};

/**
 * Obtiene todos los modelos de neumáticos para el select de "Compra Directa".
 */
export async function obtenerModelosNeumaticos(): Promise<ModeloNeumatico[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("modelos_neumaticos")
    .select("id, marca, medida, vida_util_km")
    .order("marca", { ascending: true });

  if (error) {
    console.error("Error al obtener modelos:", error.message);
    return [];
  }
  return data || [];
}

/**
 * Server Action TRANSACCIONAL — Reemplazo de neumático en 1 paso.
 *
 * Flujo:
 * 1. Si hay neumático viejo en el slot → estado='reciclaje' + movimiento de baja
 * 2a. Si viene de inventario (Tab1) → UPDATE neumático existente a 'instalado'
 * 2b. Si es compra directa (Tab2)  → INSERT nuevo neumático + movimiento
 * 3. revalidatePath para refrescar el chasis
 */
export async function ejecutarReemplazoNeumatico(params: {
  busId: string;
  posicion: string;
  kilometrajeMomento: number;
  // Datos del neumático viejo (si había uno)
  neumaticoViejoId?: string | null;
  // --- Tab 1: Desde Inventario ---
  modo: "inventario" | "compra_directa";
  neumaticoInventarioId?: string | null;
  // --- Tab 2: Compra Directa ---
  modeloId?: string | null;
  factura?: string | null;
  proveedor?: string | null;
  precio?: number;
  numeroSerie?: string | null;
  codigoDot?: string | null;
  cicloVida?: string | null;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No estás autenticado" };

  // Validar kilometraje
  const ultimoKm = await obtenerUltimoKmBus(params.busId);
  if (params.kilometrajeMomento < ultimoKm) {
    return { error: `El kilometraje (${params.kilometrajeMomento}) no puede ser menor al último registrado (${ultimoKm})` };
  }

  // ═══ VALIDACIÓN DE SEGURIDAD (HARD BLOCK) ═══
  // No instalar TRACCIÓN en EJE DELANTERO
  const ejeDelantero = ["delantero_izquierdo", "delantero_derecho"].includes(params.posicion);
  let aplicacionEje = "mixto";

  if (params.modo === "inventario" && params.neumaticoInventarioId) {
    const { data: neumInv } = await supabase
      .from("neumaticos")
      .select("modelos_neumaticos(aplicacion_eje)")
      .eq("id", params.neumaticoInventarioId)
      .single();
    // @ts-ignore
    if (neumInv && neumInv.modelos_neumaticos) aplicacionEje = neumInv.modelos_neumaticos.aplicacion_eje;
  } else if (params.modo === "compra_directa" && params.modeloId) {
    const { data: mod } = await supabase
      .from("modelos_neumaticos")
      .select("aplicacion_eje")
      .eq("id", params.modeloId)
      .single();
    if (mod) aplicacionEje = mod.aplicacion_eje;
  }

  if (ejeDelantero && aplicacionEje === "traccion") {
    return { error: "¡Bloqueo de Seguridad! No puedes instalar un neumático de TRACCIÓN en un eje direccional delantero." };
  }

  try {
    // ═══ PASO 1: Enviar neumático viejo a reciclaje (si existía) ═══
    if (params.neumaticoViejoId) {
      const { error: reciclarErr } = await supabase
        .from("neumaticos")
        .update({ estado: "reciclaje", bus_actual_id: null, posicion_actual: null })
        .eq("id", params.neumaticoViejoId);

      if (reciclarErr) return { error: `Error al reciclar neumático viejo: ${reciclarErr.message}` };

      // Registrar movimiento de baja
      await supabase.from("movimientos_neumaticos").insert({
        neumatico_id: params.neumaticoViejoId,
        bus_id: params.busId,
        usuario_id: user.id,
        accion: "reciclaje",
        posicion_origen: params.posicion,
        posicion_destino: null,
        kilometraje_bus_momento: params.kilometrajeMomento,
      });
    }

    // ═══ PASO 2: Instalar nuevo neumático ═══
    let nuevoNeumaticoId: string;

    if (params.modo === "inventario") {
      // --- Desde Inventario ---
      if (!params.neumaticoInventarioId) return { error: "Selecciona un neumático del inventario" };

      const { data: neum, error: fetchErr } = await supabase
        .from("neumaticos")
        .select("id, estado")
        .eq("id", params.neumaticoInventarioId)
        .single();

      if (fetchErr || !neum) return { error: "Neumático no encontrado" };
      if (neum.estado !== "inventario") return { error: "Este neumático ya no está disponible" };

      const { error: instErr } = await supabase
        .from("neumaticos")
        .update({
          estado: "instalado",
          bus_actual_id: params.busId,
          posicion_actual: params.posicion,
          desgaste_acumulado_km: 0,
        })
        .eq("id", params.neumaticoInventarioId);

      if (instErr) return { error: `Error al instalar: ${instErr.message}` };
      nuevoNeumaticoId = params.neumaticoInventarioId;

    } else {
      // --- Compra Directa ---
      if (!params.modeloId) return { error: "Selecciona un modelo de neumático" };

      // Generar código único: YYYYMMDD-NNN
      const hoy = new Date();
      const prefijo = `${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, "0")}${String(hoy.getDate()).padStart(2, "0")}`;

      // Obtener correlativo del día
      const { count } = await supabase
        .from("neumaticos")
        .select("id", { count: "exact", head: true })
        .like("codigo_unico", `${prefijo}-%`);

      const correlativo = String((count || 0) + 1).padStart(3, "0");
      const codigoUnico = `${prefijo}-${correlativo}`;

      // INSERT directo con estado 'instalado'
      const { data: nuevoNeum, error: insertErr } = await supabase
        .from("neumaticos")
        .insert({
          codigo_unico: codigoUnico,
          modelo_id: params.modeloId,
          estado: "instalado",
          bus_actual_id: params.busId,
          posicion_actual: params.posicion,
          desgaste_acumulado_km: 0,
          factura: params.factura || null,
          proveedor: params.proveedor || null,
          precio: params.precio || 0,
          numero_serie: params.numeroSerie || null,
          codigo_dot: params.codigoDot || null,
          ciclo_vida: params.cicloVida || "nuevo",
        })
        .select("id")
        .single();

      if (insertErr) return { error: `Error al crear neumático: ${insertErr.message}` };
      nuevoNeumaticoId = nuevoNeum!.id;
    }

    // ═══ PASO 3: Registrar movimiento de instalación ═══
    await supabase.from("movimientos_neumaticos").insert({
      neumatico_id: nuevoNeumaticoId,
      bus_id: params.busId,
      usuario_id: user.id,
      accion: "instalacion",
      posicion_origen: null,
      posicion_destino: params.posicion,
      kilometraje_bus_momento: params.kilometrajeMomento,
    });

  } catch (err) {
    return { error: `Error inesperado: ${String(err)}` };
  }

  revalidatePath("/operaciones/taller/rotacion");

  return {
    success: true,
    mensaje: params.neumaticoViejoId
      ? "Neumático reemplazado exitosamente (viejo → reciclaje)"
      : "Neumático instalado exitosamente",
  };
}
