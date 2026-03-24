import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import RegistrosNeumaticosCliente from "./neumaticos-cliente";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Historial de Neumáticos | Correcciones",
  description: "Edición y seguimiento de movimientos de neumáticos",
};

export default async function RegistrosNeumaticosPage() {
  const supabase = await createClient();

  const { data: movimientos } = await supabase
    .from("movimientos_neumaticos")
    .select(`
      id,
      accion,
      posicion_origen,
      posicion_destino,
      kilometraje_bus_momento,
      fecha_hora,
      buses (patente),
      usuarios (nombre_completo),
      neumaticos (codigo_unico)
    `)
    .order("fecha_hora", { ascending: false })
    .limit(300);

  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Historial de Neumáticos</h1>
          <p className="text-sm text-slate-400">{(movimientos || []).length} movimientos encontrados en todo el sistema</p>
        </div>
      </header>
      <main className="flex-1 w-full mx-auto max-w-6xl mt-6">
        <RegistrosNeumaticosCliente initialData={movimientos || []} />
      </main>
    </div>
  );
}
