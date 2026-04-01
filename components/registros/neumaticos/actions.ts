"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMovimientosNeumaticos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movimientos_neumaticos")
    .select(`
      id,
      accion,
      posicion_origen,
      posicion_destino,
      kilometraje_bus_momento,
      fecha_hora,
      buses (patente),
      usuarios (nombre_completo),
      neumaticos (codigo_unico)
    `)
    .order("fecha_hora", { ascending: false })
    .limit(300);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function actualizarMovimientoNeumatico(id: string, kilometraje: number) {
  const supabase = await createClient();
  
  if (kilometraje < 0) {
      return { error: "El kilometraje no puede ser negativo." };
  }

  const { error } = await supabase
    .from("movimientos_neumaticos")
    .update({ kilometraje_bus_momento: kilometraje })
    .eq("id", id);
    
  if (error) return { error: error.message };
  
  revalidatePath("/admin/registros");
  revalidatePath("/admin/auditoria");
  return { success: true };
}
