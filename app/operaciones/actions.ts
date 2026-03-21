"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

/**
 * Obtiene el último kilometraje registrado para un bus específico.
 *
 * Consulta la tabla `registros_combustible` filtrando por bus_id,
 * ordenando por fecha y hora descendente, y tomando solo el primer registro.
 * Si no hay registros previos, retorna 0.
 *
 * Se usa en el formulario para mostrar el "último km" y validar el hard block.
 */
export async function obtenerUltimoKilometraje(busId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("registros_combustible")
    .select("kilometraje")
    .eq("bus_id", busId)
    .order("fecha", { ascending: false })
    .order("hora", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return 0; // Sin registros previos
  }

  return data.kilometraje;
}

/**
 * Server Action para registrar una nueva carga de combustible.
 *
 * Flujo:
 * 1. Extrae y valida los datos del FormData
 * 2. Obtiene el usuario autenticado (para guardar quién hizo el registro)
 * 3. Valida en el servidor que km actual > último km (segunda barrera)
 * 4. Inserta el registro en `registros_combustible`
 * 5. Si la BD tiene un trigger "hard block", captura ese error también
 * 6. Usa revalidatePath para refrescar los datos en la UI
 */
export async function registrarCargaCombustible(formData: FormData) {
  const busId = formData.get("bus_id") as string;
  const fecha = formData.get("fecha") as string;
  const hora = formData.get("hora") as string;
  const kilometraje = parseInt(formData.get("kilometraje") as string, 10);
  const litrosCargados = parseFloat(formData.get("litros_cargados") as string);

  // Validación básica
  if (!busId || !fecha || !hora || isNaN(kilometraje) || isNaN(litrosCargados)) {
    return { error: "Todos los campos son obligatorios" };
  }

  if (kilometraje <= 0) {
    return { error: "El kilometraje debe ser mayor a 0" };
  }

  if (litrosCargados <= 0) {
    return { error: "Los litros cargados deben ser mayores a 0" };
  }

  const supabase = await createClient();

  // Obtener usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No estás autenticado" };
  }

  // Validación del lado del servidor (Hard Block): km actual > último km
  const ultimoKm = await obtenerUltimoKilometraje(busId);
  const { data: busData } = await supabase
    .from("buses")
    .select("patente, capacidad_estanque")
    .eq("id", busId)
    .single();

  const estanque_max = busData?.capacidad_estanque;

  // Alerta de "Estanque Fantasma"
  if (estanque_max && litrosCargados > estanque_max) {
    const excedentePct = Math.round(((litrosCargados - estanque_max) / estanque_max) * 100);
    await supabase.from("alertas_sistema").insert({
      bus_id: busId,
      tipo: "estanque_fantasma",
      severidad: "critica",
      titulo: `Alerta: Estanque Fantasma (${busData.patente})`,
      detalle: `Se intentó cargar ${litrosCargados} L, superando la capacidad máxima de ${estanque_max} L (+${excedentePct}%). Carga bloqueada.`,
      usuario_id: user.id
    });

    return { 
      error: `Carga bloqueada: Intentaste reportar ${litrosCargados} L, superando la capacidad máxima del bus (${estanque_max} L). Se ha notificado al administrador.` 
    };
  }

  if (kilometraje <= ultimoKm) {
    return {
      error: `El kilometraje (${kilometraje}) debe ser mayor al último registrado (${ultimoKm})`,
    };
  }

  // Insertar en la tabla registros_combustible
  const { error: dbError } = await supabase
    .from("registros_combustible")
    .insert({
      bus_id: busId,
      usuario_id: user.id,
      fecha,
      hora,
      kilometraje,
      litros_cargados: litrosCargados,
    });

  if (dbError) {
    // Capturar error del trigger SQL (hard block de la BD)
    if (dbError.message.includes("kilometraje")) {
      return { error: `La base de datos rechazó el registro: ${dbError.message}` };
    }
    return { error: `Error al guardar: ${dbError.message}` };
  }

  // Refrescar los datos de la página para que se actualicen los Server Components
  revalidatePath("/operaciones");

  return { success: true, mensaje: "Carga de combustible registrada exitosamente" };
}
