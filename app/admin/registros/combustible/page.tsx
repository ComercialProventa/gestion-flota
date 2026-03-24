import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import RegistrosCombustibleCliente from "./registros-cliente";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Historial de Combustible | Correcciones",
  description: "Edición y seguimiento de cargas de combustible",
};

export default async function RegistrosCombustiblePage() {
  const supabase = await createClient();

  const { data: registros } = await supabase
    .from("registros_combustible")
    .select(`
      id,
      fecha,
      hora,
      kilometraje,
      litros_cargados,
      buses (patente),
      usuarios (nombre_completo)
    `)
    .order("fecha", { ascending: false })
    .order("hora", { ascending: false })
    .limit(300);

  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Historial de Combustible</h1>
          <p className="text-sm text-slate-400">{(registros || []).length} registros encontrados</p>
        </div>
      </header>
      <main className="flex-1 w-full mx-auto max-w-6xl mt-6">
        <RegistrosCombustibleCliente initialData={registros || []} />
      </main>
    </div>
  );
}
