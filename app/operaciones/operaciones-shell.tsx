"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/operaciones", icon: "home" },
  { label: "Combustible", href: "/operaciones/combustible", icon: "fuel" },
  { label: "Rotación", href: "/operaciones/taller/rotacion", icon: "rotate" },
  { label: "Ingreso", href: "/operaciones/taller/inventario", icon: "box" },
];

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  const c = className || "h-5 w-5";
  switch (icon) {
    case "home":
      return <svg xmlns="http://www.w3.org/2000/svg" className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    case "fuel":
      return <svg xmlns="http://www.w3.org/2000/svg" className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>;
    case "rotate":
      return <svg xmlns="http://www.w3.org/2000/svg" className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>;
    case "box":
      return <svg xmlns="http://www.w3.org/2000/svg" className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
    case "wrench":
      return <svg xmlns="http://www.w3.org/2000/svg" className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M15.17 11.42L21 5.58A2.652 2.652 0 0017.25 1.83l-5.83 5.83" /></svg>;
    default:
      return null;
  }
}

export default function OperacionesShell({
  children,
  backHref,
  rol,
  title = "PROVENTA", // Nuevo: Título de página
  subtitle            // Nuevo: Contexto (ej: Op. Marcelo)
}: {
  children: React.ReactNode;
  backHref?: string;
  rol?: string;
  title?: string;
  subtitle?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 antialiased">
      {/* ─── Header de Consola (Optimizado) ─── */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 h-20">
        <div className="mx-auto flex h-full max-w-sm items-center justify-between px-4">

          <div className="flex items-center gap-4">
            {/* Botón Atrás: Menos redondeado, más técnico */}
            {backHref && (
              <Link
                href={backHref}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-amber-500 active:bg-white/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </Link>
            )}

            {/* Contexto Centralizado: Título y Operario */}
            <div className="flex flex-col justify-center">
              <h1 className="text-[14px] font-black uppercase tracking-tighter leading-none text-white">
                {title}
              </h1>
              {subtitle && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="h-1 w-2 rounded-full bg-amber-500/50" />
                  <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                    {subtitle}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Menú Hamburguesa: Consistente con el botón atrás */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 active:bg-white/10"
            aria-label="Menú"
          >
            <span className={`h-0.5 w-5 bg-white transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-3 bg-amber-500 self-end mr-3 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2 w-5" : ""}`} />
          </button>
        </div>
      </header>

      {/* ─── Drawer Lateral (Bordes rectificados) ─── */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <nav className="fixed top-20 right-0 z-50 w-72 h-[calc(100vh-5rem)] border-l border-white/10 bg-[#121214] shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 space-y-1.5">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] px-3 mb-4">Navegación Sistema</p>
              {NAV_ITEMS.map((item) => {
                if (rol === "conductor" && item.href !== "/operaciones" && item.href !== "/operaciones/combustible") return null;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-4 rounded-lg px-4 py-3.5 text-[14px] font-bold transition-all ${isActive ? "bg-amber-500 text-black" : "text-slate-400 active:bg-white/5"
                      }`}
                  >
                    <NavIcon icon={item.icon} className={isActive ? "text-black" : "text-slate-500"} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="absolute bottom-0 w-full p-6 border-t border-white/5 bg-black">
              <Link href="/login" className="flex items-center justify-center gap-3 rounded-lg bg-red-500/10 py-4 text-[13px] font-black uppercase tracking-widest text-red-500 active:bg-red-500 active:text-white transition-all">
                Cerrar Sesión
              </Link>
            </div>
          </nav>
        </>
      )}

      {/* ─── Main Content (Optimizado) ─── */}
      <main className="mx-auto max-w-sm px-4 pt-6 pb-12">
        {children}
      </main>
    </div>
  );
}