import type { Metadata } from "next";
import Link from "next/link";
import UsuariosAdmin from "./usuarios-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gestión de Usuarios | Panel Admin",
};

export default function UsuariosAdminPage() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-border-default pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">Gestión de Usuarios</h1>
          <p className="text-sm text-zinc-400">Administración de cuentas y permisos.</p>
        </div>

        <Link
          href="/admin/usuarios/nuevo"
          className="flex items-center justify-center gap-2 rounded-lg bg-accent-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-accent-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Usuario
        </Link>
      </header>

      <main className="flex-1 w-full mx-auto max-w-6xl mt-2">
        <UsuariosAdmin />
      </main>
    </div>
  );
}
