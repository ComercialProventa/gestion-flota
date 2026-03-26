"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

/**
 * Crear un nuevo modelo de neumático.
 *
 * Valida marca, medida y vida útil, luego inserta en la tabla
 * modelos_neumaticos. Captura error de duplicados si existiera.
 */

/**
 * Obtener todos los modelos de neumáticos (Usado por React Query)
 */
export async function getModelos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("modelos_neumaticos")
    .select("*")
    .order("marca", { ascending: true });

  if (error) throw new Error(error.message);
  console.log("Datos recibidos:", data);
  return data;
}


export async function crearModelo(formData: FormData) {
  const marca = (formData.get("marca") as string || "").trim();
  const medida = (formData.get("medida") as string || "").trim();
  const aplicacion_eje = formData.get("aplicacion_eje") as string;
  const vidaUtilKm = parseInt(formData.get("vida_util_km") as string, 10);

  if (!marca) return { error: "La marca es obligatoria" };
  if (!medida) return { error: "La medida es obligatoria" };
  if (!aplicacion_eje) return { error: "La aplicación es obligatoria" };
  if (isNaN(vidaUtilKm) || vidaUtilKm < 1000) {
    return { error: "La vida útil debe ser al menos 1.000 km" };
  }

  const supabase = await createClient();

  const { error: dbError } = await supabase
    .from("modelos_neumaticos")
    .insert({
      marca,
      medida,
      aplicacion_eje,
      profundidad_estria_nueva_mm: 20, // Default value to satisfy database
      vida_util_km: vidaUtilKm
    });

  if (dbError) {
    return { error: `Error al guardar: ${dbError.message}` };
  }

  revalidatePath("/admin/neumaticos/modelos");
  return { success: true, mensaje: "Modelo creado exitosamente" };
}

/**
 * Eliminar un modelo de neumático por su ID.
 *
 * Si hay neumáticos vinculados a este modelo (modelo_id FK),
 * Supabase lanzará un error de FK que capturamos.
 */
export async function eliminarModelo(modeloId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("modelos_neumaticos")
    .delete()
    .eq("id", modeloId);

  if (error) {
    if (error.code === "23503") {
      return { error: "No se puede eliminar: hay neumáticos usando este modelo" };
    }
    return { error: `Error al eliminar: ${error.message}` };
  }

  revalidatePath("/admin/neumaticos/modelos");
  return { success: true };
}
