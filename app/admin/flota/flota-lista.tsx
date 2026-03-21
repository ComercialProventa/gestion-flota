"use client";

import { useState } from "react";
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
  asientos: number;
  chasis: string;
  vencimiento_revision_tecnica: string | null;
  vencimiento_seguro: string | null;
  creado_en?: string;
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {unidades.map((u) => (
          <div
            key={u.id}
            className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 transition-all hover:border-sky-500/30 hover:bg-slate-800 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <a href={`/admin/flota/${u.id}`} className="flex-1">
                <p className="font-mono text-lg font-bold text-white tracking-wider group-hover:text-sky-400 transition-colors">
                  {u.patente}
                </p>
                <p className="text-sm text-slate-400">
                  {u.marca} {u.modelo} · {u.ano}
                </p>
              </a>
              <div className="flex items-center gap-1.5 ml-2">
                <span className="rounded-full bg-slate-700/60 px-2.5 py-1 text-[10px] font-medium text-slate-400">
                  {EJES_LABEL[u.chasis] || u.chasis}
                </span>
              </div>
            </div>

            {/* Chasis mini */}
            <div className="rounded-xl bg-slate-900/50 p-2.5 mb-3 overflow-x-auto">
              <ChasisPreview tipo={u.chasis as any} compact />
            </div>

            {/* Vigencias compactas */}
            <div className="space-y-2 mb-3">
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

            {/* Acciones */}
            <div className="flex gap-2 pt-2 border-t border-slate-700/30">
              <a
                href={`/admin/flota/${u.id}/editar`}
                className="flex-1 rounded-lg bg-sky-600/15 px-3 py-2 text-xs font-semibold text-sky-400 text-center hover:bg-sky-600/25 transition-colors"
              >
                Editar Unidad
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
    </>
  );
}
