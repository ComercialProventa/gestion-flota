"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getRegistrosCombustible() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registros_combustible")
    .select(`
      id,
      fecha,
      hora,
      kilometraje,
      litros_cargados,
      buses (patente),
      usuarios (nombre_completo)
    `)
    .order("fecha", { ascending: false })
    .order("hora", { ascending: false })
    .limit(300);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function actualizarRegistroCombustible(id: string, litros: number, kilometraje: number) {
  const supabase = await createClient();
  
  if (litros <= 0 || kilometraje <= 0) {
      return { error: "Valores inválidos. Revisa litros y kilómetros." };
  }

  const { error } = await supabase
    .from("registros_combustible")
    .update({ litros_cargados: litros, kilometraje })
    .eq("id", id);
    
  if (error) return { error: error.message };
  
  revalidatePath("/admin/registros/combustible");
  revalidatePath("/admin/auditoria");
  return { success: true };
}

export async function eliminarRegistroCombustible(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("registros_combustible")
    .delete()
    .eq("id", id);
    
  if (error) return { error: error.message };
  
  revalidatePath("/admin/registros/combustible");
  revalidatePath("/admin/auditoria");
  return { success: true };
}
