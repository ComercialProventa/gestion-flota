import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import OperacionesShell from "../operaciones-shell";
import CombustibleCliente from "./combustible-cliente";

export const metadata: Metadata = {
  title: "Registro de Combustible | Operaciones",
  description: "Registro de cargas de combustible para buses",
};

export default async function CombustiblePage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;
  
  // Obtener rol del usuario
  let rol = "taller_conductor";
  let nombreCorto = "Conductor";
  if (userId) {
    const { data: userRoleData } = await supabase
      .from("usuarios")
      .select("rol, nombre_completo")
      .eq("id", userId)
      .single();
    if (userRoleData) {
      rol = userRoleData.rol;
      if (userRoleData.nombre_completo) {
        nombreCorto = userRoleData.nombre_completo.split(" ")[0];
      }
    }
  }

  // Cargar todos los buses, incluyendo foto_url
  const { data: allBuses } = await supabase
    .from("buses")
    .select("id, patente, foto_url, capacidad_estanque")
    .order("patente", { ascending: true });

  let displayBuses = allBuses || [];

  // Si es estrictamente 'conductor', filtrar solo los buses que tiene asignados
  if (rol === "conductor" && userId) {
    const { data: asignaciones } = await supabase
      .from("asignacion_flota")
      .select("bus_id")
      .eq("usuario_id", userId);
    
    const asignadosIds = new Set(asignaciones?.map((a) => a.bus_id) || []);
    displayBuses = displayBuses.filter((b) => asignadosIds.has(b.id));
  }

  // Cargar las cargas de los últimos 2 días registradas por este usuario
  let historialCargas: any[] = [];
  if (userId) {
    const dosDiasAtras = new Date();
    dosDiasAtras.setDate(dosDiasAtras.getDate() - 2);
    const fechaLimite = dosDiasAtras.toISOString().split("T")[0];

    const { data: historial } = await supabase
      .from("registros_combustible")
      .select(`
        id,
        fecha,
        hora,
        kilometraje,
        litros_cargados,
        buses ( patente )
      `)
      .eq("usuario_id", userId)
      .gte("fecha", fechaLimite)
      .order("fecha", { ascending: false })
      .order("hora", { ascending: false })
      .limit(50);
      
    historialCargas = historial || [];
  }

  return (
    <OperacionesShell title="Combustible" backHref="/operaciones" rol={rol}>
      <div className="pt-2 pb-4 px-1">
        <h1 className="text-xl font-bold text-white tracking-tight">Hola, {nombreCorto}</h1>
        <p className="text-[12px] text-white/50 mt-1">
          {rol === "conductor" ? "Registra tu nueva carga de combustible" : "Gestiona las cargas de flota"}
        </p>
      </div>

      <div className="pb-8">
        <CombustibleCliente buses={displayBuses} historial={historialCargas} rol={rol} />
      </div>
    </OperacionesShell>
  );
}
