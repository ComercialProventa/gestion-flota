import { createClient } from "./server";

/**
 * Sube una imagen de vehículo a Supabase Storage (bucket "vehiculos").
 * 
 * Genera un nombre de archivo único basado en UUID para evitar colisiones.
 * Requiere que el bucket sea público para retornar la publicUrl.
 * 
 * @param file El objeto File (imagen) desde el FormData
 * @returns { url: string } o { error: string }
 */
export async function subirImagenVehiculo(file: File) {
  try {
    const supabase = await createClient(); // Cliente Server-Side seguro

    if (!file || file.size === 0) {
      return { error: "No se proporcionó un archivo válido." };
    }

    // Asegurar que sea imagen
    if (!file.type.startsWith("image/")) {
      return { error: "El archivo debe ser una imagen." };
    }

    // Generar nombre de archivo único
    const ext = file.name.split(".").pop() || "jpg";
    const uniqueFileName = `${crypto.randomUUID()}-${Date.now()}.${ext}`;

    // Subir a bucket "vehiculos"
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("vehiculos")
      .upload(uniqueFileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error al subir imagen:", uploadError);
      return { error: `Error durante la subida: ${uploadError.message}` };
    }

    // Obtener la URL pública del archivo recién subido
    const { data: publicUrlData } = supabase.storage
      .from("vehiculos")
      .getPublicUrl(uploadData.path);

    // Retorna la URL directa
    return { url: publicUrlData.publicUrl };

  } catch (err: any) {
    console.error("Excepción en subirImagenVehiculo:", err);
    return { error: `Excepción no controlada: ${err.message}` };
  }
}
