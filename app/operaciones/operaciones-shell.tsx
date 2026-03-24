"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/operaciones", icon: "home" },
  { label: "Combustible", href: "/operaciones/combustible", icon: "fuel" },
  { label: "Rotación", href: "/operaciones/taller/rotacion", icon: "rotate" },
  { label: "Ingreso", href: "/operaciones/taller/inventario", icon: "box" },
  { label: "Mantenimiento", href: "/operaciones/mantenimiento", icon: "wrench" },
];

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  const c = className || "h-4 w-4";
  switch (icon) {
    case "home":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case "fuel":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        </svg>
      );
    case "rotate":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
      );
    case "box":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      );
    case "wrench":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M15.17 11.42L21 5.58A2.652 2.652 0 0017.25 1.83l-5.83 5.83" />
        </svg>
      );
    default:
      return null;
  }
}

export default function OperacionesShell({
  children,
  title = "Operaciones",
  backHref,
  rol,
}: {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
  rol?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-sm items-center justify-between px-4 h-11">
          <div className="flex items-center gap-2.5">
            {backHref ? (
              <Link
                href={backHref}
                className="flex h-7 w-7 items-center justify-center rounded-md text-amber-500 hover:text-amber-400 active:bg-amber-500/10 transition-colors -ml-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </Link>
            ) : null}
            <h1 className="text-[15px] font-semibold text-white tracking-tight">{title}</h1>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-amber-500 hover:text-amber-400 active:bg-amber-500/10 transition-colors cursor-pointer -mr-1"
            aria-label="Menú"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ─── Mobile Nav Drawer ─── */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="fixed top-11 right-0 z-50 w-64 max-h-[calc(100vh-2.75rem)] overflow-y-auto rounded-bl-2xl border-l border-b border-white/[0.08] bg-[#1c1c1e]/90 backdrop-blur-3xl shadow-2xl">
            <div className="p-3 space-y-0.5">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 pb-2 pt-1">MENÚ PRINCIPAL</p>
              {NAV_ITEMS.map((item) => {
                if (rol === "conductor" && item.href !== "/operaciones" && item.href !== "/operaciones/combustible") {
                  return null;
                }
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                      isActive ? "bg-amber-500/10 text-amber-500" : "text-white/70 hover:bg-white/[0.06] hover:text-white active:bg-white/[0.1]"
                    }`}
                  >
                    <NavIcon icon={item.icon} className={`h-[18px] w-[18px] ${isActive ? "text-amber-500" : "text-white/40"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-white/[0.06] p-3">
              <Link
                href="/login"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Cerrar Sesión
              </Link>
            </div>
          </nav>
        </>
      )}

      {/* ─── Content ─── */}
      <main className="mx-auto max-w-sm px-4 py-5 space-y-4">
        {children}
      </main>
    </div>
  );
}
