"use client";

import { useState, useMemo } from "react";

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

// Formateador limpio
function formatFecha(iso: string) {
  const safeIso = iso.replace(' ', 'T');
  return new Date(safeIso).toLocaleString("es-CL", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
}

// Minimalismo: Solo el color del punto (Status Dot)
const DOT_COLOR = {
  INSERT: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
  UPDATE: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
  DELETE: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]",
};

export default function AuditoriaCliente({ initialLogs }: { initialLogs: any[] }) {
  const [logs] = useState<AuditLog[]>(initialLogs);
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

  // Variables de diseño corporativo
  const labelClasses = "block text-[10px] font-medium text-slate-500 mb-1.5 uppercase tracking-widest";
  const inputClasses = "w-full rounded border border-white/10 bg-black/40 py-2 pl-9 pr-3 text-[13px] text-slate-200 placeholder-slate-600 focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 focus:outline-none transition-colors";

  // Estado vacío ultra minimalista
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-white/10 rounded bg-white/[0.01]">
        <h3 className="text-[13px] font-medium text-slate-400">Sin actividad reciente</h3>
        <p className="mt-1 text-[11px] text-slate-600">Los cambios en el sistema aparecerán registrados aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 antialiased">

      {/* Buscador */}
      <div className="relative w-full sm:max-w-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
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
              className="rounded border border-white/5 bg-[#121214] overflow-hidden transition-colors hover:border-white/10"
            >
              <div
                className="flex flex-col sm:flex-row gap-3 p-2.5 sm:items-center cursor-pointer select-none"
                onClick={() => setExpandido(isExpanded ? null : log.id)}
              >
                {/* MetaInfo Izquierda */}
                <div className="flex items-center gap-2.5 min-w-[160px]">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-white/5 border border-white/10 font-medium text-slate-400 text-[10px]">
                    {autorAvatar}
                  </div>
                  <div>
                    <p className="font-medium text-[12px] text-slate-200 truncate max-w-[120px] leading-none">{autor}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-none">{formatFecha(log.fecha)}</p>
                  </div>
                </div>

                {/* Info Acción (Status Dot) */}
                <div className="flex flex-1 items-center gap-2.5 w-full mt-1 sm:mt-0">
                  <div className="flex items-center gap-1.5 rounded border border-white/5 bg-white/[0.02] px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-400">
                    <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLOR[log.accion]}`} />
                    {log.accion}
                  </div>
                  <span className="text-slate-700 text-[11px]">en</span>
                  <span className="font-mono text-[10px] text-slate-300">
                    {log.tabla_afectada}
                  </span>
                  <span className="text-slate-700 text-[11px]">/</span>
                  <span className="font-mono text-[10px] text-slate-500 truncate max-w-[60px]">
                    {log.registro_id.split("-")[0]}
                  </span>
                </div>

                {/* Icono Expansión Mínimo */}
                <div className="shrink-0 text-slate-600 sm:ml-auto hidden sm:block pr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Área de expansión JSON */}
              {isExpanded && (
                <div className="border-t border-white/5 bg-black/40 p-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* OLD */}
                    {(log.accion === 'UPDATE' || log.accion === 'DELETE') && (
                      <div>
                        <span className={labelClasses}>Estado Anterior</span>
                        <div className="bg-[#0a0a0a] rounded border border-white/5 p-2 overflow-x-auto">
                          <pre className="text-[10px] text-slate-400 font-mono leading-relaxed opacity-80">
                            {JSON.stringify(log.valores_anteriores, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* NEW */}
                    {(log.accion === 'INSERT' || log.accion === 'UPDATE') && (
                      <div>
                        <span className={labelClasses}>Nuevo Estado</span>
                        <div className="bg-[#0a0a0a] rounded border border-white/5 p-2 overflow-x-auto">
                          <pre className="text-[10px] text-slate-300 font-mono leading-relaxed">
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