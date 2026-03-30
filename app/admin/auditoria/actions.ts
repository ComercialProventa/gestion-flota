"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAuditoria() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("registro_auditoria")
    .select(`
      id,
      fecha,
      accion,
      tabla_afectada,
      registro_id,
      valores_anteriores,
      valores_nuevos,
      usuario_id,
      usuarios (
        nombre_completo,
        correo,
        rol
      )
    `)
    .order("fecha", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return data || [];
}
