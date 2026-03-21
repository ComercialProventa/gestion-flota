"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import VigenciaCompacta from "@/components/flota/vigencia-compacta";
import ChasisPreview from "@/components/buses/chasis-preview";
import { EJES_LABEL } from "@/components/buses/chasis-preview";
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
};

export default function FlotaLista({ unidades }: { unidades: Unidad[] }) {
  // ─── Estado de modales ──────────────────────────────────
  const [eliminando, setEliminando] = useState<Unidad | null>(null);
  const [elimLoading, setElimLoading] = useState(false);
  const [elimError, setElimError] = useState<string | null>(null);

  const [renovando, setRenovando] = useState<{
    unidad: Unidad;
    tipo: "revision_tecnica" | "seguro";
    label: string;
  } | null>(null);
  const [renovarFecha, setRenovarFecha] = useState("");
  const [renovarLoading, setRenovarLoading] = useState(false);
  const [renovarError, setRenovarError] = useState<string | null>(null);

  // ─── Eliminar ──────────────────────────────────────────
  async function handleEliminar() {
    if (!eliminando) return;
    setElimLoading(true);
    setElimError(null);
    const result = await eliminarUnidad(eliminando.id);
    setElimLoading(false);
    if (result.error) {
      setElimError(result.error);
    } else {
      setEliminando(null);
    }
  }

  // ─── Renovar documento ────────────────────────────────
  async function handleRenovar() {
    if (!renovando || !renovarFecha) return;
    setRenovarLoading(true);
    setRenovarError(null);
    const result = await renovarDocumentoUnidad(renovando.unidad.id, renovando.tipo, renovarFecha);
    setRenovarLoading(false);
    if (result.error) {
      setRenovarError(result.error);
    } else {
      setRenovando(null);
      setRenovarFecha("");
    }
  }

  // ─── Filtrado en Memoria ──────────────────────────────
  const [busqueda, setBusqueda] = useState("");

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

  return (
    <div className="space-y-6">
      {/* ─── Buscador ─── */}
      <div className="relative max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar por patente, marca o modelo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 py-3 pl-12 pr-4 text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {unidadesFiltradas.map((u) => (
          <div
            key={u.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 transition-all hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-900/10 group"
          >
            {/* ─── Cabecera Fotográfica ─── */}
            <div className="relative h-48 w-full bg-slate-700/50 shrink-0">
              {u.foto_url ? (
                <Image
                  src={u.foto_url}
                  alt={`Unidad ${u.patente}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
              )}
              {/* Badge Patente (Estilo Placa Real) */}
              <div className="absolute top-3 right-3 rounded-md bg-white px-2.5 py-1 box-content border-2 border-slate-300 shadow-md">
                <p className="font-mono text-sm font-extrabold text-slate-900 tracking-widest">{u.patente}</p>
              </div>
            </div>

            {/* ─── Cuerpo de Tarjeta ─── */}
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                    <a href={`/admin/flota/${u.id}`} className="hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded">{u.marca} {u.modelo}</a>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Año {u.ano}</p>
                </div>

                <div className="shrink-0 bg-slate-900/50 px-2 py-1 rounded-lg border border-slate-700/50">
                   <p className="text-[10px] font-medium text-slate-400 text-center uppercase tracking-wider">{EJES_LABEL[u.chasis] || u.chasis}</p>
                   <div className="mt-1 h-[24px] w-full max-w-[50px] mx-auto overflow-hidden">
                     <ChasisPreview tipo={u.chasis as any} compact />
                   </div>
                </div>
              </div>

              {/* Vigencias compactas */}
              <div className="mt-auto space-y-2.5 mb-5">
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

              {/* ─── Acciones Footer ─── */}
              <div className="flex gap-2 pt-4 border-t border-slate-700/30">
                <a
                  href={`/admin/flota/${u.id}/editar`}
                  className="flex-1 rounded-lg bg-slate-700/30 px-3 py-2 text-xs font-semibold text-slate-300 text-center hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Editar
                </a>
                <button
                  type="button"
                  onClick={() => { setElimError(null); setEliminando(u); }}
                  className="flex-1 rounded-lg bg-red-600/10 px-3 py-2 text-xs font-semibold text-red-400 text-center hover:bg-red-600/20 transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Modal Eliminar ═══ */}
      {eliminando && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Eliminar Unidad</h3>
                <p className="text-xs text-slate-400">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              ¿Estás seguro de eliminar la unidad <span className="font-mono font-bold text-white">{eliminando.patente}</span> ({eliminando.marca} {eliminando.modelo})?
            </p>
            {elimError && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">❌ {elimError}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEliminando(null)}
                disabled={elimLoading}
                className="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleEliminar}
                disabled={elimLoading}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/25 hover:bg-red-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                {elimLoading ? "Eliminando..." : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Modal Renovar Documento ═══ */}
      {renovando && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700/50 bg-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600/20 text-sky-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Renovar {renovando.label}</h3>
                <p className="text-xs text-slate-400">Unidad {renovando.unidad.patente}</p>
              </div>
            </div>
            <div>
              <label htmlFor="nueva-fecha" className="block text-xs font-medium text-slate-400 mb-1.5">
                Nueva Fecha de Vencimiento
              </label>
              <input
                id="nueva-fecha"
                type="date"
                value={renovarFecha}
                onChange={(e) => setRenovarFecha(e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors"
              />
            </div>
            {renovarError && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">❌ {renovarError}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRenovando(null)}
                disabled={renovarLoading}
                className="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRenovar}
                disabled={renovarLoading || !renovarFecha}
                className="flex-1 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                {renovarLoading ? "Renovando..." : "Renovar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
