import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Mapeo de roles a su ruta base (panel principal)
 */
const ROLE_ROUTES: Record<string, string> = {
  administrador: "/admin",
  administrativo: "/administrativo",
  taller_conductor: "/operaciones",
  conductor: "/operaciones",
};

// Rutas que NO requieren autenticación (Añadimos el manifest y los iconos por seguridad extra)
const PUBLIC_ROUTES = ["/login", "/manifest.json", "/icon-192x192.png", "/icon-512x512.png"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Refrescar sesión y obtener cliente autenticado
  const { supabase, response } = await updateSession(request);

  // 2. Obtener el usuario autenticado actual
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Si es una ruta pública (como /login, manifest, etc.)
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route))) {
    // Si ya está autenticado y visita /login → redirigir a su panel
    if (user && pathname === "/login") {
      const { data: usuario } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", user.id)
        .single();

      const destino = ROLE_ROUTES[usuario?.rol as string] || "/login";
      return NextResponse.redirect(new URL(destino, request.url));
    }
    // Permitir acceso a rutas públicas
    return response;
  }

  // 4. Para rutas privadas: si NO hay sesión → redirigir a /login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Obtener el rol del usuario desde la tabla `usuarios`
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", user.id)
    .single();

  const rol = usuario?.rol;

  // Si no tiene rol asignado, enviar a login
  if (!rol || !ROLE_ROUTES[rol]) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 6. Control de acceso: verificar que la ruta corresponde al rol
  const rutaPermitida = ROLE_ROUTES[rol];

  // El administrador tiene acceso a todo
  if (rol === "administrador") {
    return response;
  }

  // Para otros roles, verificar que la ruta sea la correcta
  if (!pathname.startsWith(rutaPermitida)) {
    return NextResponse.redirect(new URL(rutaPermitida, request.url));
  }

  return response;
}

/**
 * CONFIGURACIÓN DEL MATCHER (CRÍTICO PARA PWA)
 * Excluimos explícitamente el manifest y los iconos para que el navegador los lea sin sesión.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - icon-192x192.png / icon-512x512.png (PWA icons)
     * - apple-icon.png (iOS icons)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-192x192.png|icon-512x512.png|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};