import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase con privilegios de administrador (service_role_key).
 *
 * SOLO USAR EN EL SERVIDOR — NUNCA exponer esta clave al navegador.
 *
 * Este cliente:
 * - Usa la `SUPABASE_SERVICE_ROLE_KEY` que omite todas las políticas RLS
 * - Permite crear usuarios en auth.users sin cerrar la sesión actual
 * - Se usa para operaciones administrativas como crear cuentas nuevas
 *
 * ¿Por qué no usar el cliente normal del servidor?
 * Porque `supabase.auth.admin.createUser()` requiere la clave de servicio,
 * no la clave anónima. Además, el cliente normal crea la sesión del nuevo
 * usuario, lo que cerraría la del admin actual.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
