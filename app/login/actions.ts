"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Server Action para autenticar al usuario.
 *
 * 1. Recibe el FormData del formulario de login
 * 2. Extrae correo y contraseña
 * 3. Usa el cliente Supabase del servidor para llamar a signInWithPassword
 * 4. Si hay error, retorna el mensaje para mostrarlo en el formulario
 * 5. Si es exitoso, consulta el rol del usuario en la tabla `usuarios`
 *    y redirige al panel correspondiente
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Intentar autenticación con email y contraseña
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Obtener el rol del usuario desde la tabla pública `usuarios`
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", authData.user.id)
    .single();

  // Mapeo de roles a rutas de panel principal
  const rutasPorRol: Record<string, string> = {
    administrador: "/admin",
    administrativo: "/administrativo",
    taller_conductor: "/operaciones",
  };

  const destino = rutasPorRol[usuario?.rol] || "/login";
  redirect(destino);
}
