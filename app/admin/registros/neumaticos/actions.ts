"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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
  
  revalidatePath("/admin/registros/neumaticos");
  revalidatePath("/admin/auditoria");
  return { success: true };
}
