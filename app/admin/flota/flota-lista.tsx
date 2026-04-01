"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarUnidad, renovarDocumentoUnidad } from "./actions";

export type Unidad = {
  id: string;
  patente: string;
  marca: string;
  modelo: string;
  ano: number;
  chasis: string;
  foto_url: string | null;
  vencimiento_revision_tecnica: string | null;
  vencimiento_seguro: string | null;
  capacidad_estanque: number | null;
};

function estadoTexto(fecha: string | null): { texto: string; color: string } {
  if (!fecha) return { texto: "—", color: "text-dim" };
  const dias = Math.ceil((new Date(fecha).getTime() - Date.now()) / 86400000);
  if (dias < 0) return { texto: `Vencido ${Math.abs(dias)}d`, color: "text-red" };
  if (dias <= 30) return { texto: `${dias}d`, color: "text-accent" };
  return { texto: `${dias}d`, color: "text-green" };
}

export default function FlotaLista({ unidades }: { unidades: Unidad[] }) {
  const queryClient = useQueryClient();

  const [eliminando, setEliminando] = useState<Unidad | null>(null);
  const [elimError, setElimError] = useState<string | null>(null);
  const [renovando, setRenovando] = useState<{ unidad: Unidad; tipo: "revision_tecnica" | "seguro"; label: string } | null>(null);
  const [renovarFecha, setRenovarFecha] = useState("");
  const [renovarError, setRenovarError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const eliminarMutation = useMutation({
    mutationFn: (id: string) => eliminarUnidad(id),
    onSuccess: (result) => {
      if (result.error) setElimError(result.error);
      else { queryClient.invalidateQueries({ queryKey: ["flota"] }); setEliminando(null); }
    },
    onError: () => setElimError("Fallo de conexión al eliminar."),
  });

  const renovarMutation = useMutation({
    mutationFn: ({ id, tipo, fecha }: { id: string; tipo: "revision_tecnica" | "seguro"; fecha: string }) =>
      renovarDocumentoUnidad(id, tipo, fecha),
    onSuccess: (result) => {
      if (result.error) setRenovarError(result.error);
      else { queryClient.invalidateQueries({ queryKey: ["flota"] }); setRenovando(null); setRenovarFecha(""); }
    },
    onError: () => setRenovarError("Fallo de conexión al renovar."),
  });

  function handleEliminar() { if (!eliminando) return; setElimError(null); eliminarMutation.mutate(eliminando.id); }
  function handleRenovar() { if (!renovando || !renovarFecha) return; setRenovarError(null); renovarMutation.mutate({ id: renovando.unidad.id, tipo: renovando.tipo, fecha: renovarFecha }); }

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return unidades;
    return unidades.filter((u) => u.patente.toLowerCase().includes(q) || u.marca.toLowerCase().includes(q) || u.modelo.toLowerCase().includes(q));
  }, [unidades, busqueda]);

  const inputClasses = "w-full bg-surface rounded-md px-3 py-2 text-[13px] text-foreground placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors";

  return (
    <div>
      {/* Buscador */}
      <div className="mb-5">
        <input type="text" placeholder="Buscar patente, marca o modelo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className={inputClasses} />
      </div>

      {/* Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-medium text-dim uppercase tracking-wide">
        <div className="col-span-3">Unidad</div>
        <div className="col-span-2">Patente</div>
        <div className="col-span-2">Rev. Técnica</div>
        <div className="col-span-2">Seguro</div>
        <div className="col-span-3 text-right">Acciones</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-divider">
        {filtradas.length === 0 ? (
          <div className="py-12 text-center text-dim text-[13px]">No hay unidades registradas</div>
        ) : (
          filtradas.map((u) => {
            const rt = estadoTexto(u.vencimiento_revision_tecnica);
            const sg = estadoTexto(u.vencimiento_seguro);
            return (
              <div key={u.id} className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 px-4 py-3 hover:bg-surface transition-colors group">
                <div className="md:col-span-3">
                  <Link href={`/admin/flota/${u.id}`} className="text-[13px] font-medium text-foreground hover:text-accent transition-colors">
                    {u.marca} {u.modelo}
                  </Link>
                  <p className="text-[11px] text-dim md:hidden font-mono mt-0.5">{u.patente}</p>
                </div>
                <div className="hidden md:block md:col-span-2">
                  <span className="text-[12px] font-mono font-medium text-foreground">{u.patente}</span>
                </div>
                <div className="hidden md:flex md:col-span-2 items-center gap-2">
                  <span className={`text-[12px] font-medium ${rt.color}`}>{rt.texto}</span>
                  {u.vencimiento_revision_tecnica && (
                    <button type="button" onClick={() => { setRenovarFecha(""); setRenovarError(null); setRenovando({ unidad: u, tipo: "revision_tecnica", label: "Revisión Técnica" }); }} className="text-[10px] text-dim hover:text-accent transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                      Renovar
                    </button>
                  )}
                </div>
                <div className="hidden md:flex md:col-span-2 items-center gap-2">
                  <span className={`text-[12px] font-medium ${sg.color}`}>{sg.texto}</span>
                  {u.vencimiento_seguro && (
                    <button type="button" onClick={() => { setRenovarFecha(""); setRenovarError(null); setRenovando({ unidad: u, tipo: "seguro", label: "Seguro Obligatorio" }); }} className="text-[10px] text-dim hover:text-accent transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                      Renovar
                    </button>
                  )}
                </div>
                <div className="md:col-span-3 flex md:justify-end gap-3 mt-1 md:mt-0">
                  <Link href={`/admin/flota/${u.id}/editar`} className="text-[11px] text-dim hover:text-foreground transition-colors">
                    Editar
                  </Link>
                  <button type="button" onClick={() => { setElimError(null); setEliminando(u); }} className="text-[11px] text-dim hover:text-red transition-colors cursor-pointer">
                    Dar de baja
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 py-3 text-[11px] text-dim">{filtradas.length} de {unidades.length} unidades</div>

      {/* MODAL: ELIMINAR */}
      {eliminando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-surface rounded-lg p-6 space-y-4">
            <h3 className="text-[15px] font-semibold text-foreground">Dar de Baja Unidad</h3>
            <p className="text-[13px] text-muted">
              ¿Dar de baja <span className="text-foreground font-medium">{eliminando.patente}</span>? Esta acción no se puede deshacer.
            </p>
            {elimError && <p className="text-[12px] text-red">{elimError}</p>}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setEliminando(null)} disabled={eliminarMutation.isPending} className="flex-1 py-2 text-[13px] text-dim hover:text-foreground transition-colors">Cancelar</button>
              <button type="button" onClick={handleEliminar} disabled={eliminarMutation.isPending} className="flex-1 py-2 text-[13px] font-medium text-red hover:text-red transition-colors">
                {eliminarMutation.isPending ? "Procesando..." : "Dar de Baja"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RENOVAR */}
      {renovando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-surface rounded-lg p-6 space-y-4">
            <h3 className="text-[15px] font-semibold text-foreground">Renovar Documento</h3>
            <p className="text-[12px] text-dim">{renovando.label} — <span className="text-foreground">{renovando.unidad.patente}</span></p>
            <div>
              <label className="block text-[11px] font-medium text-dim mb-1">Nueva Fecha de Vencimiento</label>
              <input type="date" value={renovarFecha} onChange={(e) => setRenovarFecha(e.target.value)} className={inputClasses} style={{ colorScheme: "dark" }} />
            </div>
            {renovarError && <p className="text-[12px] text-red">{renovarError}</p>}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setRenovando(null)} disabled={renovarMutation.isPending} className="flex-1 py-2 text-[13px] text-dim hover:text-foreground transition-colors">Cancelar</button>
              <button type="button" onClick={handleRenovar} disabled={renovarMutation.isPending || !renovarFecha} className="flex-1 py-2 text-[13px] font-medium text-accent hover:text-accent-hover transition-colors">
                {renovarMutation.isPending ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
