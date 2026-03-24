"use server";

import { createClient } from "@/utils/supabase/server";

export async function obtenerBusesYAsignaciones(usuarioId: string) {
  const supabase = await createClient();

  // 1. Obtener todos los buses
  const { data: buses, error: errBuses } = await supabase
    .from("buses")
    .select("id, patente, modelo")
    .order("patente");

  if (errBuses) return { error: errBuses.message };

  // 2. Obtener asignaciones actuales del usuario
  const { data: asignaciones, error: errAsignaciones } = await supabase
    .from("asignacion_flota")
    .select("bus_id")
    .eq("usuario_id", usuarioId);

  if (errAsignaciones) return { error: errAsignaciones.message };

  const asignadosIds = asignaciones?.map((a) => a.bus_id) || [];

  return { buses, asignadosIds };
}

export async function toggleAsignacionBus(usuarioId: string, busId: string, asignar: boolean) {
  const supabase = await createClient();

  if (asignar) {
    // Insertar
    const { error } = await supabase
      .from("asignacion_flota")
      .insert({ usuario_id: usuarioId, bus_id: busId });
    if (error) return { error: error.message };
  } else {
    // Eliminar
    const { error } = await supabase
      .from("asignacion_flota")
      .delete()
      .match({ usuario_id: usuarioId, bus_id: busId });
    if (error) return { error: error.message };
  }

  return { success: true };
}
