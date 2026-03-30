"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { subirImagenVehiculo } from "@/utils/supabase/storage";

const EJES_VALIDOS = ["2_ejes_6_ruedas", "3_ejes_10_ruedas"];

/**
 * Obtener todas las unidades de la flota (Usado por React Query)
 */
export async function getBuses() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("buses")
    .select("id, patente, marca, modelo, ano, chasis, foto_url, vencimiento_revision_tecnica, vencimiento_seguro, capacidad_estanque")
    .order("patente", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}

/**
 * Obtener una unidad por su ID
 */
export async function getUnidadById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("buses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Registrar una nueva unidad en la flota.
 */
export async function registrarUnidad(formData: FormData) {
  const patente = (formData.get("patente") as string || "").trim().toUpperCase().replace(/\s+/g, "");
  const marca = (formData.get("marca") as string || "").trim();
  const modelo = (formData.get("modelo") as string || "").trim();
  const ano = parseInt(formData.get("ano") as string, 10);
  const asientos = parseInt(formData.get("asientos") as string, 10);
  const capacidad_estanque = parseInt(formData.get("capacidad_estanque") as string, 10);
  const chasis = (formData.get("chasis") as string) || "2_ejes_6_ruedas";
  const vencimientoRevision = formData.get("vencimiento_revision_tecnica") as string || null;
  const vencimientoSeguro = formData.get("vencimiento_seguro") as string || null;

  if (!patente || patente.length < 5) return { error: "La patente debe tener al menos 5 caracteres" };
  if (!marca) return { error: "La marca es obligatoria" };
  if (!modelo) return { error: "El modelo es obligatorio" };
  if (isNaN(ano) || ano < 1990 || ano > new Date().getFullYear() + 1) return { error: "Año no válido" };
  if (isNaN(asientos) || asientos < 1 || asientos > 100) return { error: "Asientos entre 1 y 100" };
  if (isNaN(capacidad_estanque) || capacidad_estanque < 1 || capacidad_estanque > 2000) return { error: "Capacidad de estanque entre 1 y 2000 litros" };
  if (!EJES_VALIDOS.includes(chasis)) return { error: "Tipo de ejes no válido" };

  const supabase = await createClient();

  const insertPayload: Record<string, unknown> = { patente, marca, modelo, ano, asientos, chasis, capacidad_estanque };
  if (vencimientoRevision) insertPayload.vencimiento_revision_tecnica = vencimientoRevision;
  if (vencimientoSeguro) insertPayload.vencimiento_seguro = vencimientoSeguro;

  const foto = formData.get("foto") as File | null;
  if (foto && foto.size > 0) {
    const upload = await subirImagenVehiculo(foto);
    if ("error" in upload) {
      return { error: upload.error };
    }
    insertPayload.foto_url = upload.url;
  }

  const { error: dbError } = await supabase.from("buses").insert(insertPayload);

  if (dbError) {
    if (dbError.code === "23505") return { error: `Ya existe una unidad con la patente "${patente}"` };
    return { error: `Error al guardar: ${dbError.message}` };
  }

  revalidatePath("/admin/flota");
  // REDIRECT ELIMINADO - Devolvemos success para que React Query sepa que todo salió bien
  return { success: true };
}

/**
 * Actualizar datos de una unidad existente.
 */
export async function actualizarUnidad(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return { error: "ID de unidad requerido" };

  const patente = (formData.get("patente") as string || "").trim().toUpperCase().replace(/\s+/g, "");
  const marca = (formData.get("marca") as string || "").trim();
  const modelo = (formData.get("modelo") as string || "").trim();
  const ano = parseInt(formData.get("ano") as string, 10);
  const asientos = parseInt(formData.get("asientos") as string, 10);
  const capacidad_estanque = parseInt(formData.get("capacidad_estanque") as string, 10);
  const chasis = (formData.get("chasis") as string) || "2_ejes_6_ruedas";
  const vencimientoRevision = formData.get("vencimiento_revision_tecnica") as string || null;
  const vencimientoSeguro = formData.get("vencimiento_seguro") as string || null;

  if (!patente || patente.length < 5) return { error: "La patente debe tener al menos 5 caracteres" };
  if (!marca) return { error: "La marca es obligatoria" };
  if (!modelo) return { error: "El modelo es obligatorio" };
  if (isNaN(ano) || ano < 1990 || ano > new Date().getFullYear() + 1) return { error: "Año no válido" };
  if (isNaN(asientos) || asientos < 1 || asientos > 100) return { error: "Asientos entre 1 y 100" };
  if (isNaN(capacidad_estanque) || capacidad_estanque < 1 || capacidad_estanque > 2000) return { error: "Capacidad de estanque entre 1 y 2000 litros" };
  if (!EJES_VALIDOS.includes(chasis)) return { error: "Tipo de ejes no válido" };

  const supabase = await createClient();

  const updatePayload: Record<string, unknown> = {
    patente, marca, modelo, ano, asientos, chasis, capacidad_estanque,
    vencimiento_revision_tecnica: vencimientoRevision,
    vencimiento_seguro: vencimientoSeguro,
  };

  const foto = formData.get("foto") as File | null;
  if (foto && foto.size > 0) {
    const upload = await subirImagenVehiculo(foto);
    if ("error" in upload) {
      return { error: upload.error };
    }
    updatePayload.foto_url = upload.url;
  }

  const { error: dbError } = await supabase.from("buses").update(updatePayload).eq("id", id);

  if (dbError) {
    if (dbError.code === "23505") return { error: `Ya existe otra unidad con la patente "${patente}"` };
    return { error: `Error al actualizar: ${dbError.message}` };
  }

  revalidatePath("/admin/flota");
  // REDIRECT ELIMINADO
  return { success: true };
}

/**
 * Eliminar una unidad de la flota.
 */
export async function eliminarUnidad(id: string) {
  if (!id) return { error: "ID de unidad requerido" };

  const supabase = await createClient();
  const { error } = await supabase.from("buses").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") return { error: "No se puede eliminar: tiene neumáticos u otros registros asociados" };
    return { error: `Error al eliminar: ${error.message}` };
  }

  revalidatePath("/admin/flota");
  return { success: true };
}

/**
 * Quick-Action: Renovar un documento de vigencia legal.
 */
export async function renovarDocumentoUnidad(
  unidadId: string,
  tipoDocumento: "revision_tecnica" | "seguro",
  nuevaFecha: string
) {
  if (!unidadId) return { error: "ID de unidad requerido" };
  if (!nuevaFecha) return { error: "La nueva fecha es obligatoria" };

  const campo = tipoDocumento === "revision_tecnica"
    ? "vencimiento_revision_tecnica"
    : "vencimiento_seguro";

  const supabase = await createClient();
  const { error } = await supabase.from("buses").update({ [campo]: nuevaFecha }).eq("id", unidadId);

  if (error) return { error: `Error al renovar: ${error.message}` };

  revalidatePath("/admin/flota");
  return { success: true, mensaje: "Documento renovado exitosamente" };
}