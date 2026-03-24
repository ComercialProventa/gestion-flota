import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import UsuariosTable from "@/components/usuarios/usuarios-table";

export const metadata: Metadata = {
  title: "Personal | Administrativo",
  description: "Vista de solo lectura del listado de personal",
};

/**
 * Página de Listado de Usuarios (Administrativo) — Server Component.
 *
 * Vista de solo lectura. El componente UsuariosTable recibe esAdmin=false
 * por lo que NO muestra botones de edición ni la columna de acciones.
 */
export default async function UsuariosAdministrativoPage() {
  const supabase = await createClient();

  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("id, nombre_completo, rut, correo, rol, creado_en")
    .order("nombre_completo", { ascending: true });

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a
              href="/administrativo"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </a>
            <div>
              <h1 className="text-lg font-semibold text-white">Personal</h1>
              <p className="text-xs text-slate-400">{(usuarios || []).length} empleados registrados</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-400">
            Solo Lectura
          </span>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <UsuariosTable usuarios={usuarios || []} esAdmin={false} />
      </main>
    </div>
  );
}
