"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import VigenciaCompacta from "@/components/flota/vigencia-compacta";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Importaciones añadidas
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

export default function FlotaLista({ unidades }: { unidades: Unidad[] }) {
  const queryClient = useQueryClient(); // Instanciamos el cliente de caché

  const [eliminando, setEliminando] = useState<Unidad | null>(null);
  const [elimError, setElimError] = useState<string | null>(null);

  const [renovando, setRenovando] = useState<{
    unidad: Unidad;
    tipo: "revision_tecnica" | "seguro";
    label: string;
  } | null>(null);
  const [renovarFecha, setRenovarFecha] = useState("");
  const [renovarError, setRenovarError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // ─── MUTACIÓN: Eliminar Unidad ──────────────────────────────────────────
  const eliminarMutation = useMutation({
    mutationFn: (id: string) => eliminarUnidad(id),
    onSuccess: (result) => {
      if (result.error) {
        setElimError(result.error);
      } else {
        // ¡Magia de caché! Le decimos a React Query que vuelva a pedir la flota
        queryClient.invalidateQueries({ queryKey: ["flota"] });
        setEliminando(null);
      }
    },
    onError: () => setElimError("Fallo de conexión al eliminar."),
  });

  // ─── MUTACIÓN: Renovar Documento ────────────────────────────────────────
  const renovarMutation = useMutation({
    mutationFn: ({ id, tipo, fecha }: { id: string; tipo: "revision_tecnica" | "seguro"; fecha: string }) =>
      renovarDocumentoUnidad(id, tipo, fecha),
    onSuccess: (result) => {
      if (result.error) {
        setRenovarError(result.error);
      } else {
        // Invalida la caché para actualizar las fechas de vencimiento en pantalla
        queryClient.invalidateQueries({ queryKey: ["flota"] });
        setRenovando(null);
        setRenovarFecha("");
      }
    },
    onError: () => setRenovarError("Fallo de conexión al renovar."),
  });

  // ─── HANDLERS ─────────────────────────────────────────────────────────
  function handleEliminar() {
    if (!eliminando) return;
    setElimError(null);
    eliminarMutation.mutate(eliminando.id);
  }

  function handleRenovar() {
    if (!renovando || !renovarFecha) return;
    setRenovarError(null);
    renovarMutation.mutate({
      id: renovando.unidad.id,
      tipo: renovando.tipo,
      fecha: renovarFecha,
    });
  }

  const unidadesFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return unidades;
    return unidades.filter(
      (u) =>
        u.patente.toLowerCase().includes(q) ||
        u.marca.toLowerCase().includes(q) ||
        u.modelo.toLowerCase().includes(q)
    );
  }, [unidades, busqueda]);

  const labelClasses = "block text-[11px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider";
  const inputClasses = "w-full rounded-lg border border-border-strong bg-surface-overlay px-3 py-2 text-sm text-foreground placeholder:text-zinc-600 focus:border-accent focus:ring-1 focus:ring-accent/20 focus:outline-none transition-all";

  return (
    <div className="space-y-6 antialiased">
      {/* Buscador */}
      <div className="relative max-w-md w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar patente, marca o modelo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={`${inputClasses} pl-9`}
        />
      </div>

      {/* Cuadrícula de Unidades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {unidadesFiltradas.map((u) => (
          <div
            key={u.id}
            className="flex flex-col overflow-hidden rounded-xl border border-border-default bg-surface-card transition-all hover:border-border-strong group"
          >
            {/* Foto Cabecera */}
            <div className="relative h-32 w-full bg-surface-overlay shrink-0 border-b border-border-subtle">
              {u.foto_url ? (
                <Image
                  src={u.foto_url}
                  alt={`Unidad ${u.patente}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
              )}
              <div className="absolute top-2.5 right-2.5 rounded-md bg-foreground/90 px-2 py-0.5 shadow-sm">
                <p className="font-mono text-[11px] font-bold text-background tracking-wider uppercase">{u.patente}</p>
              </div>
            </div>

            {/* Cuerpo de la Tarjeta */}
            <div className="flex flex-1 flex-col p-3.5">
              <div className="mb-3">
                <h3 className="text-[13px] font-bold text-foreground truncate leading-tight group-hover:text-accent transition-colors">
                  <Link href={`/admin/flota/${u.id}`} className="focus:outline-none">{u.marca} {u.modelo}</Link>
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 font-mono text-[10px] text-zinc-500 uppercase tracking-tight">
                  <span>Año {u.ano}</span>
                  <span className="opacity-30">/</span>
                  <span>{u.capacidad_estanque || 400}L FUEL</span>
                </div>
              </div>

              {/* Vigencias Documentales */}
              <div className="mt-auto space-y-1.5 mb-4">
                <VigenciaCompacta
                  nombreDocumento="Rev. Técnica"
                  fechaVencimiento={u.vencimiento_revision_tecnica}
                  onRenovar={() => {
                    setRenovarFecha("");
                    setRenovarError(null);
                    setRenovando({ unidad: u, tipo: "revision_tecnica", label: "Revisión Técnica" });
                  }}
                />
                <VigenciaCompacta
                  nombreDocumento="Seguro"
                  fechaVencimiento={u.vencimiento_seguro}
                  onRenovar={() => {
                    setRenovarFecha("");
                    setRenovarError(null);
                    setRenovando({ unidad: u, tipo: "seguro", label: "Seguro Obligatorio" });
                  }}
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-2 pt-3 border-t border-border-subtle">
                <Link
                  href={`/admin/flota/${u.id}/editar`}
                  className="flex-1 rounded-lg border border-border-strong bg-transparent px-3 py-1.5 text-[11px] font-semibold text-zinc-400 text-center hover:bg-surface-raised hover:text-foreground transition-colors"
                >
                  Configurar
                </Link>
                <button
                  type="button"
                  onClick={() => { setElimError(null); setEliminando(u); }}
                  className="rounded border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-[11px] font-semibold text-red-400 text-center hover:bg-red-600/20 transition-colors cursor-pointer"
                >
                  Baja
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL ELIMINAR --- */}
      {eliminando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-sm rounded-xl border border-border-default bg-surface-card p-5 shadow-2xl">
            <h3 className="mb-2 text-lg font-bold text-foreground">Dar de Baja Unidad</h3>
            <p className="mb-5 text-sm text-zinc-400">
              ¿Estás seguro que deseas dar de baja el bus <span className="font-bold text-white">{eliminando.patente}</span>? Esta acción no se puede deshacer.
            </p>
            {elimError && <p className="mb-4 text-xs font-semibold text-red-400">{elimError}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEliminando(null)}
                disabled={eliminarMutation.isPending}
                className="flex-1 rounded border border-white/10 bg-transparent px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/5 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleEliminar}
                disabled={eliminarMutation.isPending}
                className="flex-1 rounded bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {eliminarMutation.isPending ? "Procesando..." : "Sí, Dar de Baja"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL RENOVAR --- */}
      {renovando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-sm rounded-xl border border-border-default bg-surface-card p-5 shadow-2xl">
            <h3 className="mb-1 text-lg font-bold text-foreground">Renovar Documento</h3>
            <p className="mb-5 text-xs text-zinc-400">
              {renovando.label} - Unidad <span className="font-bold text-white">{renovando.unidad.patente}</span>
            </p>

            <div className="mb-5">
              <label className={labelClasses}>Nueva Fecha de Vencimiento</label>
              <input
                type="date"
                value={renovarFecha}
                onChange={(e) => setRenovarFecha(e.target.value)}
                className={inputClasses}
                style={{ colorScheme: "dark" }}
              />
            </div>

            {renovarError && <p className="mb-4 text-xs font-semibold text-red-400">{renovarError}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRenovando(null)}
                disabled={renovarMutation.isPending}
                className="flex-1 rounded border border-white/10 bg-transparent px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/5 disabled:opacity-50"
              >
                Cancelar
              </button>
                <button
                  type="button"
                  onClick={handleRenovar}
                  disabled={renovarMutation.isPending || !renovarFecha}
                  className="flex-1 rounded-lg bg-accent-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-accent-500 disabled:opacity-50"
              >
                {renovarMutation.isPending ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}