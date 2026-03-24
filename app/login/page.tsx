import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Proventa Admin",
  description: "Acceso al sistema de gestión de flota de buses",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] font-sans antialiased p-4">
      <div className="w-full max-w-[360px]">

        {/* Encabezado fuera de la tarjeta para un look técnico */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Proventa Admin</h1>
          <p className="mt-1 text-xs text-slate-500 uppercase tracking-widest">Gestión de Flota</p>
        </div>

        {/* Tarjeta principal */}
        <div className="rounded-lg border border-white/10 bg-[#151517] p-6 shadow-xl">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[10px] font-medium text-slate-600 uppercase tracking-widest">
          Comercial Proventa © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}