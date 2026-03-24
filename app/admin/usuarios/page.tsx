import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import UsuariosAdmin from "./usuarios-admin";

export const metadata: Metadata = {
  title: "Gestión de Usuarios | Panel Admin",
};

export default async function UsuariosAdminPage() {
  const supabase = await createClient();

  // Optimizamos la consulta: solo los campos necesarios
  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("id, nombre_completo, rut, correo, rol, creado_en")
    .order("nombre_completo", { ascending: true });

  const lista = usuarios || [];

  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Gestión de Usuarios</h1>
          <p className="text-sm text-slate-400">{lista.length} cuentas registradas en el sistema.</p>
        </div>

        <a
          href="/admin/usuarios/nuevo"
          className="flex items-center justify-center gap-2 rounded bg-sky-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-sky-500 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Usuario
        </a>
      </header>

      <main className="flex-1 w-full mx-auto max-w-6xl mt-2">
        <UsuariosAdmin usuarios={lista} />
      </main>
    </div>
  );
}