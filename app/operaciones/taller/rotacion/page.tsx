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
    <OperacionesShell title="Neumáticos" backHref="/operaciones">
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M4.031 9.865l-.001.001" />
            </svg>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-white leading-tight">Rotación y Baja</h2>
            <p className="text-[11px] text-white/40 leading-tight">Selecciona un bus para gestionar</p>
          </div>
        </div>
        <ChasisInteractivo buses={buses || []} />
      </section>
    </OperacionesShell>
  );
}
