import { createBrowserClient } from "@supabase/ssr";

/**
 * Crea un cliente Supabase para usar en Client Components (navegador).
 *
 * `createBrowserClient` maneja las cookies de sesión automáticamente
 * desde el lado del navegador, por lo que no necesitamos configurar
 * getters/setters de cookies manualmente.
 *
 * Uso: importar esta función en cualquier componente marcado con "use client".
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
