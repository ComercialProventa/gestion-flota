// app/operaciones/combustible/page.tsx
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import OperacionesShell from "../operaciones-shell";
import CombustibleCliente from "./combustible-cliente";

export const metadata: Metadata = {
  title: "Combustible | ProVenta Ops",
};

export default async function CombustiblePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  // Consultas en paralelo: velocidad pura para que el viejo no espere con la pantalla en blanco
  const [profileRes, busesRes] = await Promise.all([
    supabase.from("usuarios").select("rol, nombre_completo").eq("id", authUser.id).single(),
    supabase.from("buses").select("id, patente, foto_url").order("patente", { ascending: true })
  ]);

  const rol = profileRes.data?.rol || "conductor";
  const nombreCorto = profileRes.data?.nombre_completo?.split(" ")[0] || "Operario";
  let displayBuses = busesRes.data || [];

  // Filtro de seguridad: El conductor no debe elegir buses que no son suyos para no "embarrarla"
  if (rol === "conductor") {
    const { data: asignaciones } = await supabase
      .from("asignacion_flota")
      .select("bus_id").eq("usuario_id", authUser.id);
    const asignadosIds = new Set(asignaciones?.map((a) => a.bus_id) || []);
    displayBuses = displayBuses.filter((b) => asignadosIds.has(b.id));
  }

  // Historial: Solo 5 para que la lista no sea un "testamento" infinito
  const { data: historial } = await supabase
    .from("registros_combustible")
    .select(`id, fecha, hora, kilometraje, litros_cargados, buses(patente)`)
    .eq("usuario_id", authUser.id)
    .order("fecha", { ascending: false })
    .order("hora", { ascending: false })
    .limit(5);

  return (
    <OperacionesShell
      backHref="/operaciones"
      rol={rol}
      title="COMBUSTIBLE"
      // Subtítulo claro y en mayúsculas para que lo vean bien
      subtitle={rol === "conductor" ? `OPERADOR: ${nombreCorto}` : "TERMINAL DE CARGA"}
    >

      {/* Contenido pegado arriba para aprovechar el scroll */}
      <div className="pb-10">
        <CombustibleCliente
          buses={displayBuses}
          historial={historial || []}
          userId={authUser.id} // VITAL: Para que el formulario guarde bien
          rol={rol}
        />
      </div>

      {/* Identificador de terminal: sutil para que parezca software de radio-control */}
      <div className="mt-auto border-t border-white/5 pt-6 opacity-20">
        <p className="text-[9px] font-mono text-center uppercase tracking-[0.2em] text-slate-500 leading-relaxed">
          SISTEMA DE CONTROL DE ENERGÍA <br />
          ZONA MAGALLANES · PUNTA ARENAS
        </p>
      </div>
    </OperacionesShell>
  );
}