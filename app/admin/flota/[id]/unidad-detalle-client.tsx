"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import ChasisPreview from "@/components/buses/chasis-preview";
import { EJES_LABEL } from "@/components/buses/chasis-preview";
import DocumentProgressBar from "@/components/ui/DocumentProgressBar";
import { getUnidadById } from "../actions";

export default function UnidadDetalleClient({ id }: { id: string }) {
  const { data: unidad, isLoading, isError, error } = useQuery({
    queryKey: ["unidad", id],
    queryFn: () => getUnidadById(id),
    staleTime: 1000 * 60 * 5,
  });

  const cardClasses = "rounded-xl border border-border-default bg-surface-card p-5";
  const innerBoxClasses = "rounded-lg border border-border-subtle bg-surface-overlay p-4";

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4"></div>
          <p className="text-sm font-medium animate-pulse">Cargando ficha...</p>
        </div>
      </main>
    );
  }

  if (isError || !unidad) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          Error al cargar la unidad: {error?.message || "No encontrada"}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6 antialiased">
      {/* Cabecera de Navegación y Título */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/flota"
            prefetch={true}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong bg-surface-overlay text-zinc-400 hover:text-foreground hover:bg-surface-raised transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground font-mono tracking-tighter uppercase">{unidad.patente}</h1>
              <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent border border-accent/20 uppercase">
                Activa
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-0.5">{unidad.marca} {unidad.modelo} · {unidad.ano}</p>
          </div>
        </div>

        <Link
          href={`/admin/flota/${unidad.id}/editar`}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          Editar Ficha
        </Link>
      </div>

      {/* Hero Foto Unidad */}
      {unidad.foto_url && (
        <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-xl border border-border-default bg-surface-overlay">
          <Image
            src={unidad.foto_url}
            alt={`Foto de unidad ${unidad.patente}`}
            fill
            className="object-cover opacity-90"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
        </div>
      )}

      {/* Grid de Información Técnicas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${cardClasses} lg:col-span-2`}>
          <h2 className="text-[12px] font-bold text-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="h-1 w-1 bg-accent rounded-full" />
            Especificaciones Técnicas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <InfoItem label="Marca" value={unidad.marca} />
            <InfoItem label="Modelo" value={unidad.modelo} />
            <InfoItem label="Año Fabricación" value={String(unidad.ano)} mono />
            <InfoItem label="Capacidad Asientos" value={String(unidad.asientos || '—')} mono />
            <InfoItem label="Capacidad Estanque" value={`${unidad.capacidad_estanque || 400} Lts`} mono />
            <InfoItem label="Configuración Chasis" value={EJES_LABEL[unidad.chasis] || unidad.chasis} />
          </div>
        </div>

        <div className={cardClasses}>
          <h2 className="text-[12px] font-bold text-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="h-1 w-1 bg-accent rounded-full" />
            Esquema de Ejes
          </h2>
          <div className={innerBoxClasses}>
            <div className="opacity-80 grayscale-[0.5] hover:grayscale-0 transition-all">
              <ChasisPreview tipo={unidad.chasis || "2_ejes_6_ruedas"} />
            </div>
          </div>
        </div>
      </div>

      {/* Vigencias Legales */}
      <div className={cardClasses}>
          <h2 className="text-[12px] font-bold text-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="h-1 w-1 bg-success rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            Estado de Documentación
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className={innerBoxClasses}>
            <DocumentProgressBar nombre="Revisión Técnica" fechaVencimiento={unidad.vencimiento_revision_tecnica} />
            {unidad.vencimiento_revision_tecnica && (
              <p className="mt-3 text-[11px] font-mono text-zinc-500 flex justify-between">
                <span>VENCIMIENTO:</span>
                <span className="text-zinc-300">{new Date(unidad.vencimiento_revision_tecnica.replace(' ', 'T')).toLocaleDateString("es-CL")}</span>
              </p>
            )}
          </div>
          <div className={innerBoxClasses}>
            <DocumentProgressBar nombre="Seguro Obligatorio" fechaVencimiento={unidad.vencimiento_seguro} />
            {unidad.vencimiento_seguro && (
              <p className="mt-3 text-[11px] font-mono text-zinc-500 flex justify-between">
                <span>VENCIMIENTO:</span>
                <span className="text-zinc-300">{new Date(unidad.vencimiento_seguro.replace(' ', 'T')).toLocaleDateString("es-CL")}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 pt-6 mt-4 border-t border-border-subtle">
          <LegendItem color="bg-emerald-500" label="Vigente (> 30 días)" />
          <LegendItem color="bg-amber-400" label="Próximo a vencer" />
          <LegendItem color="bg-red-500" label="Crítico / Vencido" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 pt-4">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
          Sistema Maestro de Flota · Comercial Proventa
        </p>
        <p className="text-[10px] text-zinc-700 font-mono">
          ID Registro: {unidad.id} · Creado el {unidad.creado_en ? new Date(unidad.creado_en.replace(' ', 'T')).toLocaleDateString("es-CL") : "—"}
        </p>
      </div>
    </main>
  );
}

function InfoItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className={`text-[13px] font-medium text-zinc-200 ${mono ? "font-mono tracking-tight" : ""}`}>
        {value || 'No especificado'}
      </p>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">{label}</span>
    </div>
  );
}
