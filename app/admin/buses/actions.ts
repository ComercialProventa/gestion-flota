"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// ============================================================================
// 1. QUERY: Obtener todos los buses
// Esta es la función que TanStack Query usará para poblar la tabla al instante
// ============================================================================
export async function getBuses() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("buses")
    .select("*")
    // Ordenamos por patente por defecto, ajusta según tu preferencia
    .order("patente", { ascending: true });

  if (error) {
    throw new Error(`Error al cargar la flota: ${error.message}`);
  }

  return data;
}

// ============================================================================
// 2. MUTATION: Registrar un nuevo bus
// ============================================================================
export async function registrarBus(formData: FormData) {
  const patente = (formData.get("patente") as string || "").trim().toUpperCase().replace(/\s+/g, "");
  const marca = (formData.get("marca") as string || "").trim();
  const modelo = (formData.get("modelo") as string || "").trim();
  const ano = parseInt(formData.get("ano") as string, 10);
  const asientos = parseInt(formData.get("asientos") as string, 10);
  const chasis = (formData.get("chasis") as string) || "estandar_6";
  const vencimientoRevision = formData.get("vencimiento_revision_tecnica") as string || null;
  const vencimientoSeguro = formData.get("vencimiento_seguro") as string || null;

  // ─── Validaciones ──────────────────────────────────────
  // Nota: Ahora retornamos { success: false, error: ... } para estandarizar la respuesta
  if (!patente || patente.length < 5) {
    return { success: false, error: "La patente debe tener al menos 5 caracteres" };
  }
  if (!marca) {
    return { success: false, error: "La marca es obligatoria" };
  }
  if (!modelo) {
    return { success: false, error: "El modelo es obligatorio" };
  }
  if (isNaN(ano) || ano < 1990 || ano > new Date().getFullYear() + 1) {
    return { success: false, error: "El año debe estar entre 1990 y el año actual" };
  }
  if (isNaN(asientos) || asientos < 1 || asientos > 100) {
    return { success: false, error: "Los asientos deben estar entre 1 y 100" };
  }
  if (!["estandar_6", "doble_piso_10"].includes(chasis)) {
    return { success: false, error: "Tipo de chasis no válido" };
  }

  const supabase = await createClient();

  const insertPayload: Record<string, unknown> = {
    patente,
    marca,
    modelo,
    ano,
    asientos,
  };

  // Solo agregar fechas si vienen completas
  if (vencimientoRevision) insertPayload.vencimiento_revision_tecnica = vencimientoRevision;
  if (vencimientoSeguro) insertPayload.vencimiento_seguro = vencimientoSeguro;

  const { error: dbError } = await supabase
    .from("buses")
    .insert(insertPayload);

  if (dbError) {
    // Error de patente duplicada (código 23505 = unique_violation)
    if (dbError.code === "23505") {
      return { success: false, error: `Ya existe un bus con la patente "${patente}"` };
    }
    return { success: false, error: `Error al guardar: ${dbError.message}` };
  }

  // ─── Éxito ──────────────────────────────────────────────
  // 1. Revalidamos la caché del servidor de Next.js por seguridad
  revalidatePath("/admin/buses");

  // 2. Retornamos success: true (TanStack Query usará esto para invalidar su caché)
  return { success: true };
}