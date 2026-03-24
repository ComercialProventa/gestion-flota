"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function registrarMantenimiento(formData: FormData) {
  const busId = formData.get("bus_id") as string;
  const fecha = formData.get("fecha") as string;
  const tipoPieza = formData.get("tipo_pieza") as string;
  const descripcion = formData.get("descripcion") as string;
  const costo = parseInt(formData.get("costo") as string, 10);

  if (!busId || !fecha || !tipoPieza) {
    return { error: "Bus, fecha y tipo de pieza son obligatorios" };
  }

  if (isNaN(costo) || costo < 0) {
    return { error: "El costo debe ser un número válido mayor o igual a 0" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No estás autenticado" };
  }

  const { error: dbError } = await supabase
    .from("registros_mantenimiento")
    .insert({
      bus_id: busId,
      usuario_id: user.id,
      tipo_pieza: tipoPieza,
      descripcion: descripcion || null,
      costo,
      fecha,
    });

  if (dbError) {
    return { error: `Error al guardar: ${dbError.message}` };
  }

  // Verificar anomalía en tiempo real (ej: cambió >3 veces esta pieza en 30 días)
  const fechaActual = new Date(fecha);
  const fechaHace30Dias = new Date(fechaActual);
  fechaHace30Dias.setDate(fechaActual.getDate() - 30);
  const fechaInicioIso = fechaHace30Dias.toISOString().split("T")[0];

  const { count } = await supabase
    .from("registros_mantenimiento")
    .select("id", { count: "exact", head: true })
    .eq("bus_id", busId)
    .eq("tipo_pieza", tipoPieza)
    .gte("fecha", fechaInicioIso)
    .lte("fecha", fecha);

  if (count && count >= 3) {
    // Es una anomalía, generar alerta
    const { data: bus } = await supabase.from("buses").select("patente").eq("id", busId).single();
    if (bus) {
      await supabase.from("alertas_sistema").insert({
        bus_id: busId,
        tipo: "mantenimiento_anomalo",
        severidad: "alta",
        titulo: `Anomalía: ${tipoPieza} (${bus.patente})`,
        detalle: `La pieza '${tipoPieza}' ha sido reemplazada ${count} veces en los últimos 30 días. Posible falla mecánica oculta o robo de repuestos.`,
        usuario_id: user.id
      });
    }
  }

  revalidatePath("/operaciones/mantenimiento");
  return { success: true, mensaje: "Registro de mantenimiento guardado exitosamente" };
}
