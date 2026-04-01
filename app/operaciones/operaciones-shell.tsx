"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { signOut } from "@/app/login/actions";

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
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-divider h-20">
        <div className="mx-auto flex h-full max-w-sm items-center justify-between px-4">

          <div className="flex items-center gap-4">
            {backHref && (
              <Link
                href={backHref}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-divider bg-surface text-accent active:bg-surface-hover transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </Link>
            )}

            <div className="flex flex-col justify-center">
              <h1 className="text-[14px] font-black uppercase tracking-tighter leading-none text-foreground">
                {title}
              </h1>
              {subtitle && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="h-1 w-2 rounded-full bg-accent/50" />
                  <p className="text-[9px] font-mono font-bold text-muted uppercase tracking-widest">
                    {subtitle}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-divider bg-surface active:bg-surface-hover"
            aria-label="Menú"
          >
            <span className={`h-0.5 w-5 bg-foreground transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-5 bg-foreground transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-3 bg-accent self-end mr-3 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2 w-5" : ""}`} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <nav className="fixed top-20 right-0 z-50 w-72 h-[calc(100vh-5rem)] border-l border-divider bg-surface shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 space-y-1.5">
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] px-3 mb-4">Navegación Sistema</p>
              {NAV_ITEMS.map((item) => {
                if (rol === "conductor" && item.href !== "/operaciones" && item.href !== "/operaciones/combustible") return null;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-4 rounded-lg px-4 py-3.5 text-[14px] font-bold transition-all ${isActive ? "bg-accent text-black" : "text-dim active:bg-surface-hover"
                      }`}
                  >
                    <NavIcon icon={item.icon} className={isActive ? "text-black" : "text-dim"} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="absolute bottom-0 w-full p-6 border-t border-divider bg-background space-y-2">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center gap-3 rounded-lg bg-surface py-3 text-[12px] font-bold uppercase tracking-widest text-dim active:bg-surface-hover transition-all"
              >
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
                {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
              </button>
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 rounded-lg bg-red-500/10 py-4 text-[13px] font-black uppercase tracking-widest text-red-500 active:bg-red-500 active:text-white transition-all"
                >
                  Cerrar Sesión
                </button>
              </form>
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