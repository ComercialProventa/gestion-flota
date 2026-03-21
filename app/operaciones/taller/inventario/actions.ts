"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

/**
 * Obtener todos los modelos de neumáticos para el selector del formulario.
 */
export async function obtenerModelos() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("modelos_neumaticos")
    .select("id, marca, medida")
    .order("marca", { ascending: true });

  return data || [];
}

/**
 * Generar el código único de identidad del neumático.
 *
 * Formato: [YYYYMMDD]-[SERIAL]
 * - Si el usuario provee un serial/código del proveedor, se usa ese.
 * - Si no hay serial, se genera un correlativo basado en cuántos
 *   neumáticos se registraron hoy (auto-incremento diario).
 *
 * Ejemplo con serial:   20260320-MIC12345
 * Ejemplo sin serial:   20260320-0001
 */
async function generarCodigoUnico(serial: string | null): Promise<string> {
  const hoy = new Date();
  const fechaStr =
    hoy.getFullYear().toString() +
    (hoy.getMonth() + 1).toString().padStart(2, "0") +
    hoy.getDate().toString().padStart(2, "0");

  if (serial && serial.trim().length > 0) {
    // Limpiar el serial: quitar espacios, uppercase
    const serialLimpio = serial.trim().toUpperCase().replace(/\s+/g, "");
    return `${fechaStr}-${serialLimpio}`;
  }

  // Sin serial → generar correlativo del día
  const supabase = await createClient();
  const prefijo = `${fechaStr}-`;

  // Contar cuántos neumáticos ya se registraron hoy con este prefijo
  const { count } = await supabase
    .from("neumaticos")
    .select("*", { count: "exact", head: true })
    .like("codigo_unico", `${prefijo}%`);

  const correlativo = ((count || 0) + 1).toString().padStart(4, "0");
  return `${prefijo}${correlativo}`;
}

/**
 * Server Action — Registrar un neumático nuevo en el inventario.
 *
 * Flujo:
 * 1. Valida que venga un modelo_id
 * 2. Genera el código único de identidad
 * 3. Inserta en la tabla neumaticos con estado 'inventario'
 * 4. Si el código ya existe (unique constraint), regenera con sufijo
 */
export async function registrarNeumaticoInventario(formData: FormData) {
  const modeloId = formData.get("modelo_id") as string;
  const serial = formData.get("serial") as string || null;
  const facturaNumero = (formData.get("factura_numero") as string || "").trim() || null;
  const proveedor = (formData.get("proveedor") as string || "").trim() || null;

  if (!modeloId) {
    return { error: "Debes seleccionar un modelo de neumático" };
  }

  // Generar código único
  const codigoUnico = await generarCodigoUnico(serial);

  const supabase = await createClient();

  const { error: dbError } = await supabase
    .from("neumaticos")
    .insert({
      codigo_unico: codigoUnico,
      modelo_id: modeloId,
      estado: "inventario",
      desgaste_acumulado_km: 0,
      factura_numero: facturaNumero,
      proveedor,
    });

  if (dbError) {
    // Si es unique constraint, el serial ya fue usado hoy
    if (dbError.code === "23505") {
      return { error: `Ya existe un neumático con el código "${codigoUnico}". Usa un serial distinto.` };
    }
    return { error: `Error al guardar: ${dbError.message}` };
  }

  revalidatePath("/operaciones/taller/inventario");
  return {
    success: true,
    mensaje: `Neumático registrado con código: ${codigoUnico}`,
    codigoGenerado: codigoUnico,
  };
}
