"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function getPerfilOperario() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("usuarios")
    .select("nombre_completo, rol")
    .eq("id", authUser.id)
    .single();

  return {
    userId: authUser.id,
    nombre: profile?.nombre_completo?.split(" ")[0] || "Operario",
    rol: profile?.rol || "conductor",
  };
}

export async function getBusesParaCombustible() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return { buses: [], rol: "conductor" };

  const [profileRes, busesRes] = await Promise.all([
    supabase.from("usuarios").select("rol").eq("id", authUser.id).single(),
    supabase.from("buses").select("id, patente, foto_url, capacidad_estanque").order("patente"),
  ]);

  const rol = profileRes.data?.rol || "conductor";
  let buses = busesRes.data || [];

  if (rol === "conductor") {
    const { data: asignaciones } = await supabase
      .from("asignacion_flota")
      .select("bus_id").eq("usuario_id", authUser.id);
    const ids = new Set(asignaciones?.map((a) => a.bus_id) || []);
    buses = buses.filter((b) => ids.has(b.id));
  }

  return { buses, rol };
}

export async function getHistorialCombustible() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return [];

  const { data } = await supabase
    .from("registros_combustible")
    .select("id, fecha, hora, kilometraje, litros_cargados, buses(patente)")
    .eq("usuario_id", authUser.id)
    .order("fecha", { ascending: false })
    .order("hora", { ascending: false })
    .limit(5);

  return data || [];
}

export async function getBusesParaOperaciones() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("buses")
    .select("id, patente")
    .order("patente");

  return data || [];
}

export async function getBusesParaRotacion() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("buses")
    .select("id, patente, foto_url, chasis, neumaticos(posicion_actual)")
    .order("patente");

  return data || [];
}

export async function getStockInventario() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("neumaticos")
    .select(`
      id, codigo_unico, numero_serie, codigo_dot, ciclo_vida, creado_en,
      modelos_neumaticos ( marca, medida ), usuarios ( nombre_completo )
    `)
    .eq("estado", "inventario")
    .order("creado_en", { ascending: false });

  return data || [];
}

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
