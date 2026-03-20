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
