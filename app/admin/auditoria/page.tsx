import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import AuditoriaCliente from "./auditoria-cliente";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Bitácora de Auditoría",
  description: "Registro detallado de cambios y trazabilidad del sistema",
};

export default async function AuditoriaPage() {
  const supabase = await createClient();

  // Obtenemos los últimos 100 registros con un left join a la tabla usuarios
  // En Supabase, si 'usuario_id' es foreign key, podemos usar la sintaxis relacional
  const { data: logs } = await supabase
    .from("registro_auditoria")
    .select(`
      id,
      fecha,
      accion,
      tabla_afectada,
      registro_id,
      valores_anteriores,
      valores_nuevos,
      usuario_id,
      usuarios (
        nombre_completo,
        correo,
        rol
      )
    `)
    .order("fecha", { ascending: false })
    .limit(100);

  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Bitácora de Auditoría</h1>
          <p className="text-sm text-slate-400">Trazabilidad en tiempo real de los cambios del sistema</p>
        </div>
      </header>
      <main className="flex-1 w-full mt-2">
        <AuditoriaCliente initialLogs={logs || []} />
      </main>
    </div>
  );
}
