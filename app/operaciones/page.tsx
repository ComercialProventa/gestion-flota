"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client"; // Cambiado a cliente para facilitar la interactividad
import OperacionesShell from "./operaciones-shell";

export default function OperacionesDashboard() {
  const [user, setUser] = useState<{ nombre: string; rol: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from("usuarios")
          .select("nombre_completo, rol")
          .eq("id", authUser.id)
          .single();

        setUser({
          nombre: profile?.nombre_completo?.split(" ")[0] || "Operario",
          rol: profile?.rol || "conductor"
        });
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  if (loading) return null; // El loading.tsx se encarga de esto

  return (
    <OperacionesShell title="Inicio" rol={user?.rol || "conductor"}>
      <div className="space-y-8 antialiased">

        {/* ─── Cabecera de Bienvenida ─── */}
        <div className="px-1 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">
            Sistema de Operaciones
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tighter">
            Hola, {user?.nombre}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">
              {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        {/* ─── Sección de Acceso Rápido (Grid Estilo Industrial) ─── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Item: Combustible */}
          <DashboardCard
            href="/operaciones/combustible"
            title="Combustible"
            subtitle="Carga de Petróleo"
            color="amber"
            icon={(
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              </svg>
            )}
          />

          {/* Solo visible para Taller/Admin */}
          {user?.rol !== "conductor" && (
            <>
              <DashboardCard
                href="/operaciones/taller/rotacion"
                title="Rotación"
                subtitle="Gestión de Ejes"
                color="orange"
                icon={(
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                )}
              />

              <DashboardCard
                href="/operaciones/taller/inventario"
                title="Bodega"
                subtitle="Stock Neumáticos"
                color="emerald"
                icon={(
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                )}
              />

              <DashboardCard
                href="/operaciones/mantenimiento"
                title="Taller"
                subtitle="Hojas de Ruta"
                color="sky"
                icon={(
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M15.17 11.42L21 5.58A2.652 2.652 0 0017.25 1.83l-5.83 5.83" />
                  </svg>
                )}
              />
            </>
          )}
        </div>

        {/* ─── Footer Informativo ─── */}
        <div className="rounded-lg border border-white/5 bg-black/20 p-4 mt-8">
          <p className="text-[11px] font-mono text-slate-600 text-center uppercase tracking-widest leading-relaxed">
            Comercial Proventa · {new Date().getFullYear()}<br />
            v2.4.0 — Terminal Punta Arenas
          </p>
        </div>
      </div>
    </OperacionesShell>
  );
}

// ─── Componente de Tarjeta Refactorizado ───

function DashboardCard({ href, title, subtitle, color, icon }: any) {
  const colorMap: any = {
    amber: "bg-amber-500 text-black shadow-amber-500/20",
    orange: "bg-orange-500 text-black shadow-orange-500/20",
    emerald: "bg-emerald-500 text-black shadow-emerald-500/20",
    sky: "bg-sky-500 text-black shadow-sky-500/20",
  };

  return (
    <Link
      href={href}
      className="group relative flex flex-col items-start gap-5 overflow-hidden rounded-xl border border-white/10 bg-[#151517] p-5 transition-all active:scale-[0.95] active:bg-[#1c1c1f]"
    >
      {/* Icon Container */}
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorMap[color]} shadow-lg transition-transform group-hover:scale-110`}>
        {icon}
      </div>

      <div className="space-y-1">
        <h3 className="text-[15px] font-bold text-white tracking-tight">{title}</h3>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{subtitle}</p>
      </div>

      {/* Indicador sutil de acción */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}