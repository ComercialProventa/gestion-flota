import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Actualiza (refresca) la sesión del usuario en cada request.
 *
 * El middleware de Next.js se ejecuta ANTES de cada página. Aquí creamos
 * un cliente Supabase que lee las cookies de la request entrante, y si
 * los tokens están próximos a expirar, los refresca automáticamente.
 *
 * Las cookies actualizadas se escriben tanto en la request (para que
 * los Server Components las lean) como en la response (para que el
 * navegador las almacene).
 *
 * Retorna un objeto con:
 * - `supabase`: cliente autenticado para consultas en el middleware
 * - `response`: la response con cookies actualizadas
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1. Escribir cookies en la request (para Server Components)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // 2. Crear nueva response con las cookies de la request actualizada
          supabaseResponse = NextResponse.next({
            request,
          });
          // 3. Escribir cookies en la response (para el navegador)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refrescar la sesión (esto dispara setAll si los tokens se actualizan)
  await supabase.auth.getUser();

  return { supabase, response: supabaseResponse };
}
