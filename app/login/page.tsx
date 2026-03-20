import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Gestión de Flota",
  description: "Accede al sistema de gestión de flota de buses",
};

/**
 * Página de Login — Server Component.
 *
 * Esta página es un Server Component (por defecto en App Router), lo que
 * significa que se renderiza en el servidor y no incluye JavaScript innecesario
 * en el bundle del cliente.
 *
 * El diseño usa un degradado oscuro con una tarjeta centrada con efecto
 * glasmorfismo. El formulario interactivo se delega a <LoginForm />,
 * que es un Client Component.
 */
export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Tarjeta de login */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo / Ícono */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600/20 text-sky-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
          </div>

          {/* Título */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white">Gestión de Flota</h1>
            <p className="mt-2 text-sm text-slate-400">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          {/* Formulario (Client Component) */}
          <LoginForm />
        </div>

        {/* Pie de tarjeta */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Sistema de gestión interna · Comercial Proventa
        </p>
      </div>
    </div>
  );
}
