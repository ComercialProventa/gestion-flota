"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

/**
 * Server Action — Registrar un nuevo bus en la flota.
 *
 * Flujo:
 * 1. Extrae y valida todos los campos del FormData
 * 2. Normaliza la patente (mayúsculas, sin espacios)
 * 3. Inserta el bus en Supabase
 * 4. Captura el error de patente duplicada (23505)
 * 5. Redirige a /admin/buses tras éxito
 */
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
  if (!patente || patente.length < 5) {
    return { error: "La patente debe tener al menos 5 caracteres" };
  }
  if (!marca) {
    return { error: "La marca es obligatoria" };
  }
  if (!modelo) {
    return { error: "El modelo es obligatorio" };
  }
  if (isNaN(ano) || ano < 1990 || ano > new Date().getFullYear() + 1) {
    return { error: "El año debe estar entre 1990 y el año actual" };
  }
  if (isNaN(asientos) || asientos < 1 || asientos > 100) {
    return { error: "Los asientos deben estar entre 1 y 100" };
  }
  if (!["estandar_6", "doble_piso_10"].includes(chasis)) {
    return { error: "Tipo de chasis no válido" };
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
      return { error: `Ya existe un bus con la patente "${patente}"` };
    }
    return { error: `Error al guardar: ${dbError.message}` };
  }

  revalidatePath("/admin/buses");
  redirect("/admin/buses");
}
