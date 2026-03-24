import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import OperacionesShell from "./operaciones-shell";

export const metadata: Metadata = {
  title: "Operaciones | Gestión de Flota",
  description: "Panel principal de operaciones",
};

export default async function OperacionesDashboard() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;
  
  let nombreCorto = "Operario";
  let rol = "taller_conductor";
  if (userId) {
    const { data: userRow } = await supabase
      .from("usuarios")
      .select("nombre_completo, rol")
      .eq("id", userId)
      .single();
    
    if (userRow) {
      if (userRow.nombre_completo) {
        nombreCorto = userRow.nombre_completo.split(" ")[0]; // Primer nombre
      }
      if (userRow.rol) {
        rol = userRow.rol;
      }
    }
  }

  return (
    <OperacionesShell title="Inicio" rol={rol}>
      {/* ─── Hero / Saludo ─── */}
      <div className="pt-2 pb-6 px-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Hola, {nombreCorto}</h1>
        <p className="text-[13px] text-white/50 mt-1">¿Qué deseas gestionar hoy?</p>
      </div>

      {/* ─── Grid de Herramientas (App Home Screen) ─── */}
      <div className="grid grid-cols-2 gap-3.5">
        
        {/* Combustible */}
        <Link
          href="/operaciones/combustible"
          className="flex flex-col items-start gap-4 rounded-[20px] bg-[#1c1c1e] p-5 shadow-sm active:scale-[0.96] transition-transform"
        >
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl bg-amber-500 shadow-md shadow-amber-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-white leading-tight">Combustible</h3>
            <span className="text-[11px] font-medium text-white/40 mt-1 block">Registrar carga</span>
          </div>
        </Link>

        {/* Las demás herramientas ocultas para conductores */}
        {rol !== "conductor" && (
          <>
            {/* Rotación de Neumáticos */}
            <Link
              href="/operaciones/taller/rotacion"
              className="flex flex-col items-start gap-4 rounded-[20px] bg-[#1c1c1e] p-5 shadow-sm active:scale-[0.96] transition-transform"
            >
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl bg-amber-500 shadow-md shadow-amber-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white leading-tight">Rotación</h3>
                <span className="text-[11px] font-medium text-white/40 mt-1 block">Esquema 3D</span>
              </div>
            </Link>



            {/* Ingreso Inventario */}
            <Link
              href="/operaciones/taller/inventario"
              className="flex flex-col items-start gap-4 rounded-[20px] bg-[#1c1c1e] p-5 shadow-sm active:scale-[0.96] transition-transform"
            >
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl bg-emerald-500 shadow-md shadow-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white leading-tight">Bodega</h3>
                <span className="text-[11px] font-medium text-white/40 mt-1 block">Añadir Neumático</span>
              </div>
            </Link>

            {/* Mantenimiento */}
            <Link
              href="/operaciones/mantenimiento"
              className="flex flex-col items-start gap-4 rounded-[20px] bg-[#1c1c1e] p-5 shadow-sm active:scale-[0.96] transition-transform"
            >
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl bg-sky-500 shadow-md shadow-sky-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px] text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M15.17 11.42L21 5.58A2.652 2.652 0 0017.25 1.83l-5.83 5.83" />
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white leading-tight">Taller</h3>
                <span className="text-[11px] font-medium text-white/40 mt-1 block">Mantenimiento</span>
              </div>
            </Link>
          </>
        )}
        
      </div>

    </OperacionesShell>
  );
}
