"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuditoria } from "./actions";

export type AuditLog = {
  id: string;
  fecha: string;
  accion: "INSERT" | "UPDATE" | "DELETE";
  tabla_afectada: string;
  registro_id: string;
  valores_anteriores: any | null;
  valores_nuevos: any | null;
  usuario_id: string | null;
  usuarios?: {
    nombre_completo: string | null;
    correo: string | null;
    rol: string | null;
  } | null;
};

function formatFecha(iso: string) {
  const safeIso = iso.replace(' ', 'T');
  return new Date(safeIso).toLocaleString("es-CL", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
}

const DOT_COLOR = {
  INSERT: "bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]",
  UPDATE: "bg-warning shadow-[0_0_8px_rgba(245,158,11,0.4)]",
  DELETE: "bg-danger shadow-[0_0_8px_rgba(239,68,68,0.4)]",
};

export default function AuditoriaCliente() {
  const { data: logsData, isLoading } = useQuery<AuditLog[]>({
    queryKey: ["auditoria"],
    queryFn: async () => {
      const data = await getAuditoria();
      return data as unknown as AuditLog[];
    },
    staleTime: 1000 * 60 * 2,
  });

  const logs: AuditLog[] = logsData || [];
  const [busqueda, setBusqueda] = useState("");
  const [expandido, setExpandido] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return logs;
    return logs.filter(log => {
      const nombreString = log.usuarios?.nombre_completo?.toLowerCase() || "sistema";
      const accionStr = log.accion.toLowerCase();
      const tablaStr = log.tabla_afectada.toLowerCase();
      const uuidStr = log.registro_id.toLowerCase();
      return nombreString.includes(q) || accionStr.includes(q) || tablaStr.includes(q) || uuidStr.includes(q);
    });
  }, [logs, busqueda]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4"></div>
        <p className="text-sm font-medium animate-pulse">Cargando bitácora...</p>
      </div>
    );
  }

  const labelClasses = "block text-[10px] font-medium text-zinc-500 mb-1.5 uppercase tracking-widest";
  const inputClasses = "w-full rounded-lg border border-border-strong bg-surface-overlay py-2 pl-9 pr-3 text-[13px] text-foreground placeholder:text-zinc-600 focus:border-accent focus:ring-1 focus:ring-accent/20 focus:outline-none transition-colors";

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border-strong rounded-xl bg-surface-card">
        <h3 className="text-[13px] font-medium text-zinc-400">Sin actividad reciente</h3>
        <p className="mt-1 text-[11px] text-zinc-600">Los cambios en el sistema aparecerán registrados aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 antialiased">
      {/* Buscador */}
      <div className="relative w-full sm:max-w-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar registros..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Lista de Registros */}
      <div className="space-y-1.5">
        {filtrados.map((log) => {
          const isExpanded = expandido === log.id;
          const autor = log.usuarios?.nombre_completo || "Sistema";
          const autorAvatar = autor.charAt(0).toUpperCase();

          return (
            <div
              key={log.id}
              className="rounded-lg border border-border-default bg-surface-card overflow-hidden transition-colors hover:border-border-strong"
            >
              <div
                className="flex flex-col sm:flex-row gap-3 p-2.5 sm:items-center cursor-pointer select-none"
                onClick={() => setExpandido(isExpanded ? null : log.id)}
              >
                {/* MetaInfo Izquierda */}
                <div className="flex items-center gap-2.5 min-w-[160px]">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-overlay border border-border-default font-medium text-zinc-400 text-[10px]">
                    {autorAvatar}
                  </div>
                  <div>
                    <p className="font-medium text-[12px] text-zinc-200 truncate max-w-[120px] leading-none">{autor}</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5 leading-none">{formatFecha(log.fecha)}</p>
                  </div>
                </div>

                {/* Info Acción */}
                <div className="flex flex-1 items-center gap-2.5 w-full mt-1 sm:mt-0">
                  <div className="flex items-center gap-1.5 rounded-md border border-border-default bg-surface-overlay px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                    <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLOR[log.accion]}`} />
                    {log.accion}
                  </div>
                  <span className="text-zinc-700 text-[11px]">en</span>
                  <span className="font-mono text-[10px] text-zinc-300">
                    {log.tabla_afectada}
                  </span>
                  <span className="text-zinc-700 text-[11px]">/</span>
                  <span className="font-mono text-[10px] text-zinc-500 truncate max-w-[60px]">
                    {log.registro_id.split("-")[0]}
                  </span>
                </div>

                {/* Icono Expansión */}
                <div className="shrink-0 text-zinc-600 sm:ml-auto hidden sm:block pr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Área de expansión JSON */}
              {isExpanded && (
                <div className="border-t border-border-subtle bg-surface-overlay p-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {(log.accion === 'UPDATE' || log.accion === 'DELETE') && (
                      <div>
                        <span className={labelClasses}>Estado Anterior</span>
                        <div className="bg-background rounded-lg border border-border-subtle p-2 overflow-x-auto">
                          <pre className="text-[10px] text-zinc-400 font-mono leading-relaxed opacity-80">
                            {JSON.stringify(log.valores_anteriores, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {(log.accion === 'INSERT' || log.accion === 'UPDATE') && (
                      <div>
                        <span className={labelClasses}>Nuevo Estado</span>
                        <div className="bg-background rounded-lg border border-border-subtle p-2 overflow-x-auto">
                          <pre className="text-[10px] text-zinc-300 font-mono leading-relaxed">
                            {JSON.stringify(log.valores_nuevos, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
