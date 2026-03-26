import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ChasisInteractivo from "./chasis-interactivo";
import OperacionesShell from "../../operaciones-shell";

export const metadata: Metadata = {
  title: "Rotación de Neumáticos | Taller",
  description: "Gestión visual de neumáticos — rotación y baja",
};

export default async function RotacionPage() {
  const supabase = await createClient();

  const { data: buses } = await supabase
    .from("buses")
    .select("id, patente, foto_url, chasis, neumaticos(posicion_actual)")
    .order("patente", { ascending: true });

  return (
    <OperacionesShell
      title="ROTACIÓN Y EJES"
      subtitle="TALLER MECÁNICO"
      backHref="/operaciones"
    >
      <div className="pb-12 animate-in fade-in duration-300">

        {/* ─── Etiqueta de Contexto Técnico ─── */}
        <div className="mb-6 border-b-2 border-white/10 pb-4 flex items-center justify-between">
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-orange-500">
            Control de Rodado
          </h2>
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            {buses?.length || 0} Unidades
          </span>
        </div>

        {/* ─── Herramienta Directa (Sin tarjetas ni envoltorios) ─── */}
        <ChasisInteractivo buses={buses || []} />

      </div>
    </OperacionesShell>
  );
}