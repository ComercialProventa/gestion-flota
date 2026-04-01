import type { Metadata } from "next";
import Link from "next/link";
import UsuariosAdmin from "./usuarios-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gestión de Usuarios | Panel Admin",
};

export default function UsuariosAdminPage() {
  return (
    <div className="max-w-5xl">
      <header className="flex items-center justify-between px-8 pt-10 pb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-foreground">Gestión de Usuarios</h1>
          <p className="text-[13px] text-muted mt-0.5">Administración de cuentas y permisos.</p>
        </div>
        <Link
          href="/admin/usuarios/nuevo"
          className="text-[13px] font-medium text-accent hover:text-accent-hover transition-colors"
        >
          + Nuevo usuario
        </Link>
      </header>

      <main className="px-8 pb-12">
        <UsuariosAdmin />
      </main>
    </div>
  );
}
