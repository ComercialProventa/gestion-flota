"use server";

import { createAdminClient } from "@/utils/supabase/admin";

/**
 * Genera una contraseña aleatoria de 8 caracteres (letras y números).
 *
 * Usa solo caracteres alfanuméricos para evitar problemas con caracteres
 * especiales al comunicar la contraseña al nuevo usuario.
 */
function generarContrasena(): string {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let contrasena = "";
  for (let i = 0; i < 8; i++) {
    contrasena += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  }
  return contrasena;
}

/**
 * Server Action para crear un nuevo usuario desde el panel de administración.
 *
 * Flujo:
 * 1. Valida los datos del formulario
 * 2. Genera una contraseña aleatoria de 8 caracteres
 * 3. Usa el cliente admin (service_role_key) para crear el usuario en auth.users
 *    → Esto NO cierra la sesión del administrador actual
 * 4. Inserta los datos complementarios (nombre, RUT, rol) en public.usuarios
 * 5. Retorna la contraseña generada para que el admin la comunique al empleado
 */
export async function crearUsuario(formData: FormData) {
  const nombreCompleto = formData.get("nombre_completo") as string;
  const rut = formData.get("rut") as string;
  const correo = formData.get("correo") as string;
  const rol = formData.get("rol") as string;

  // Validación básica
  if (!nombreCompleto || !rut || !correo || !rol) {
    return { error: "Todos los campos son obligatorios" };
  }

  // Validar que el rol sea válido
  const rolesValidos = ["administrador", "administrativo", "taller_conductor"];
  if (!rolesValidos.includes(rol)) {
    return { error: "Rol no válido" };
  }

  // Generar contraseña automática
  const contrasena = generarContrasena();

  // Crear cliente admin (service_role_key)
  const supabaseAdmin = createAdminClient();

  // Paso 1: Crear usuario en auth.users
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: correo,
      password: contrasena,
      email_confirm: true, // Confirmar email automáticamente (usuarios internos)
    });

  if (authError) {
    return { error: `Error al crear cuenta: ${authError.message}` };
  }

  // Paso 2: Insertar datos complementarios en la tabla pública `usuarios`
  const { error: dbError } = await supabaseAdmin.from("usuarios").insert({
    id: authData.user.id, // Mismo UUID que auth.users
    nombre_completo: nombreCompleto,
    rut,
    correo,
    rol,
  });

  if (dbError) {
    // Si falla la inserción, eliminar el usuario de auth para mantener consistencia
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return { error: `Error al guardar datos: ${dbError.message}` };
  }

  // Éxito: retornar la contraseña generada
  return {
    success: true,
    contrasena,
    mensaje: `Usuario ${nombreCompleto} creado exitosamente`,
  };
}
