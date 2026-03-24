"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Obtiene todos los modelos de neumáticos disponibles
 */
export async function obtenerModelosNeumaticos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modelos_neumaticos")
    .select("id, marca, medida")
    .order("marca", { ascending: true });

  if (error) {
    console.error("Error al obtener modelos_neumaticos:", error.message);
    return [];
  }
  return data || [];
}

/**
 * Registra múltiples neumáticos idénticos directamente a bodega.
 */
export async function registrarIngresoBodega(datos: {
  modeloId: string;
  cantidad: number;
  factura: string | null;
  proveedor: string | null;
  precio: number;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No estás autenticado" };
  
  if (datos.cantidad < 1 || datos.cantidad > 100) {
      return { error: "La cantidad debe ser entre 1 y 100 neumáticos a la vez." };
  }

  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const prefijo = `${yyyy}${mm}${dd}`;

  const { data: existenes, error: countErr } = await supabase
    .from("neumaticos")
    .select("codigo_unico")
    .like("codigo_unico", `${prefijo}-%`)
    .order("codigo_unico", { ascending: false })
    .limit(1);

  if (countErr) return { error: `Error verificando códigos: ${countErr.message}` };

  let startCorrelativo = 1;
  if (existenes && existenes.length > 0) {
      const lastCode = existenes[0].codigo_unico;
      const correlativoStr = lastCode.split('-')[1];
      if (correlativoStr) {
          startCorrelativo = parseInt(correlativoStr, 10) + 1;
      }
  }

  const registrosParaInsertar = [];
  for (let i = 0; i < datos.cantidad; i++) {
    const nextCorrelativo = String(startCorrelativo + i).padStart(3, "0");
    const codigoUnico = `${prefijo}-${nextCorrelativo}`;
    
    registrosParaInsertar.push({
      codigo_unico: codigoUnico,
      modelo_id: datos.modeloId,
      estado: "inventario",
      bus_actual_id: null,
      posicion_actual: null,
      desgaste_acumulado_km: 0,
      factura_numero: datos.factura || null,
      proveedor: datos.proveedor || null,
      precio: datos.precio || 0,
      numero_serie: null,
      codigo_dot: null,
      ciclo_vida: "nuevo",
      usuario_creador_id: user.id
    });
  }

  const { error: insertErr } = await supabase
    .from("neumaticos")
    .insert(registrosParaInsertar);

  if (insertErr) return { error: `Error al registrar lote: ${insertErr.message}` };

  revalidatePath("/admin/neumaticos/inventario");
  revalidatePath("/operaciones/taller/rotacion");
  revalidatePath("/operaciones/taller/inventario");
  
  return { 
      success: true, 
      mensaje: `¡Se ingresaron exitosamente ${datos.cantidad} neumáticos a la bodega!`
  };
}

/**
 * Edita los datos administrativos de un neumático.
 */
export async function editarNeumaticoBodega(id: string, datos: {
  modeloId: string;
  numeroSerie: string | null;
  codigoDot: string | null;
  factura: string | null;
  proveedor: string | null;
  precio: number;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("neumaticos")
    .update({
      modelo_id: datos.modeloId,
      numero_serie: datos.numeroSerie || null,
      codigo_dot: datos.codigoDot || null,
      factura_numero: datos.factura || null,
      proveedor: datos.proveedor || null,
      precio: datos.precio,
    })
    .eq("id", id);

  if (error) return { error: `Error editando neumático: ${error.message}` };

  revalidatePath("/admin/neumaticos/inventario");
  revalidatePath("/admin/auditoria");
  revalidatePath("/operaciones/taller/inventario");
  return { success: true };
}

/**
 * Intenta eliminar físicamente un neumático de la base de datos.
 * Con protección para Foreign Keys (ej. si tiene movimientos).
 */
export async function eliminarNeumaticoBodega(id: string) {
  const supabase = await createClient();

  // Verificación extra rápida de seguridad a nivel BD
  const { error } = await supabase
    .from("neumaticos")
    .delete()
    .eq("id", id);

  if (error) {
    if (error.code === '23503') { // PostgreSQL foreign_key_violation
      return { error: "No se puede eliminar. Este neumático ya tiene movimientos históricos o pertenece a un bus. Por seguridad operativa, cámbialo a estado 'De Baja' en lugar de borrarlo." };
    }
    return { error: `Error eliminando neumático: ${error.message}` };
  }

  revalidatePath("/admin/neumaticos/inventario");
  revalidatePath("/admin/auditoria");
  revalidatePath("/operaciones/taller/rotacion");
  revalidatePath("/operaciones/taller/inventario");
  return { success: true };
}
