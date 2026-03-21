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
