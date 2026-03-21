import type { Metadata } from "next";
import CrearUsuarioForm from "../crear-usuario-form";

export const metadata: Metadata = {
  title: "Crear Usuario | Panel Admin",
  description: "Registrar un nuevo empleado en el sistema de gestión de flota",
};

/**
 * Página de Creación de Usuarios — Server Component.
 *
 * Ruta: /admin/usuarios/nuevo
 * Solo accesible por usuarios con rol "administrador" (protegido por middleware).
 * Renderiza el formulario interactivo de creación.
 */
export default function CrearUsuarioPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <a
              href="/admin/usuarios"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </a>
            <h1 className="text-lg font-semibold text-white">Crear Nuevo Usuario</h1>
          </div>
          <span className="rounded-full bg-sky-600/10 px-3 py-1 text-xs font-medium text-sky-400">
            Administrador
          </span>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Registrar Empleado</h2>
            <p className="mt-1 text-sm text-slate-400">
              Completa los datos para crear una cuenta de acceso. Se generará una contraseña automáticamente.
            </p>
          </div>
          <CrearUsuarioForm />
        </div>
      </main>
    </div>
  );
}
