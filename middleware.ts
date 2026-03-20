import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Middleware de Next.js — Se ejecuta ANTES de cada request.
 *
 * Responsabilidades:
 * 1. Refrescar la sesión Supabase (mantener tokens actualizados)
 * 2. Proteger rutas privadas: si no hay sesión → /login
 * 3. Control de acceso por roles: cada rol solo accede a su sección
 * 4. Si un usuario autenticado visita /login → redirigir a su panel
 *
 * Mapeo de roles a rutas:
 * - administrador   → /admin/*
 * - administrativo   → /administrativo/*
 * - taller_conductor → /operaciones/*
 */

// Rutas que NO requieren autenticación
const PUBLIC_ROUTES = ["/login"];

// Mapeo de roles a su ruta base (panel principal)
const ROLE_ROUTES: Record<string, string> = {
  administrador: "/admin",
  administrativo: "/administrativo",
  taller_conductor: "/operaciones",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Refrescar sesión y obtener cliente autenticado
  const { supabase, response } = await updateSession(request);

  // 2. Obtener el usuario autenticado actual
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Si es una ruta pública (como /login)
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    // Si ya está autenticado y visita /login → redirigir a su panel
    if (user) {
      const { data: usuario } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", user.id)
        .single();

      const destino = ROLE_ROUTES[usuario?.rol] || "/login";
      return NextResponse.redirect(new URL(destino, request.url));
    }
    // Si no está autenticado, permitir acceso a /login
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

  // El administrador tiene acceso a todo (admin, administrativo, operaciones)
  if (rol === "administrador") {
    return response;
  }

  // Para otros roles, verificar que la ruta sea la correcta
  if (!pathname.startsWith(rutaPermitida)) {
    // Redirigir al panel que le corresponde
    return NextResponse.redirect(new URL(rutaPermitida, request.url));
  }

  return response;
}

/**
 * Configuración del matcher: define en qué rutas se ejecuta el middleware.
 * Excluimos archivos estáticos, imágenes y la API interna de Next.js.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
