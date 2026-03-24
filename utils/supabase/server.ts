import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Crea un cliente Supabase para usar en Server Components, Server Actions
 * y Route Handlers.
 *
 * `createServerClient` necesita acceso a las cookies de Next.js para
 * leer y escribir los tokens de sesión del usuario. Usamos `cookies()`
 * de "next/headers" que es una API asíncrona en Next.js 16+.
 *
 * El cookieStore se pasa con métodos getAll (leer todas las cookies)
 * y setAll (escribir cookies actualizadas de vuelta al navegador).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll puede fallar si se llama desde un Server Component
            // (solo lectura). Esto es seguro porque el middleware se
            // encarga de refrescar la sesión antes.
          }
        },
      },
    }
  );
}
