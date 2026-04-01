"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import ChasisPreview, { EJES_LABEL } from "@/components/buses/chasis-preview";
import DocumentProgressBar from "@/components/ui/DocumentProgressBar";
import { getUnidadById } from "../actions";

export default function UnidadDetalleClient({ id }: { id: string }) {
  const { data: unidad, isLoading, isError, error } = useQuery({
    queryKey: ["unidad", id],
    queryFn: () => getUnidadById(id),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <div className="px-8 pt-10 text-dim text-[13px]">Cargando ficha...</div>;
  }

  if (isError || !unidad) {
    return <div className="px-8 pt-10 text-red text-[13px]">Error: {error?.message || "No encontrada"}</div>;
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/flota" className="text-dim hover:text-foreground transition-colors text-[13px]">
            ← Volver
          </Link>
          <h1 className="text-[22px] font-bold text-foreground font-mono tracking-tight uppercase">{unidad.patente}</h1>
        </div>
        <Link href={`/admin/flota/${unidad.id}/editar`} className="text-[13px] font-medium text-accent hover:text-accent-hover transition-colors">
          Editar
        </Link>
      </div>

      {/* Foto */}
      {unidad.foto_url && (
        <div className="px-8 pb-6">
          <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-surface">
            <Image src={unidad.foto_url} alt={`Foto ${unidad.patente}`} fill className="object-cover opacity-90" sizes="(max-width: 1024px) 100vw, 1024px" priority />
          </div>
        </div>
      )}

      {/* Especificaciones */}
      <div className="px-8 pb-8">
        <h2 className="text-[11px] font-medium text-dim uppercase tracking-wide mb-4">Especificaciones</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
          <div>
            <p className="text-[10px] text-dim uppercase tracking-wide">Marca</p>
            <p className="text-[13px] text-foreground mt-0.5">{unidad.marca}</p>
          </div>
          <div>
            <p className="text-[10px] text-dim uppercase tracking-wide">Modelo</p>
            <p className="text-[13px] text-foreground mt-0.5">{unidad.modelo}</p>
          </div>
          <div>
            <p className="text-[10px] text-dim uppercase tracking-wide">Año</p>
            <p className="text-[13px] text-foreground font-mono mt-0.5">{unidad.ano}</p>
          </div>
          <div>
            <p className="text-[10px] text-dim uppercase tracking-wide">Asientos</p>
            <p className="text-[13px] text-foreground font-mono mt-0.5">{unidad.asientos || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] text-dim uppercase tracking-wide">Estanque</p>
            <p className="text-[13px] text-foreground font-mono mt-0.5">{unidad.capacidad_estanque || 400}L</p>
          </div>
          <div>
            <p className="text-[10px] text-dim uppercase tracking-wide">Chasis</p>
            <p className="text-[13px] text-foreground mt-0.5">{EJES_LABEL[unidad.chasis] || unidad.chasis}</p>
          </div>
        </div>
      </div>

      {/* Documentación */}
      <div className="px-8 pb-8">
        <h2 className="text-[11px] font-medium text-dim uppercase tracking-wide mb-4">Documentación</h2>
        <div className="space-y-4 max-w-md">
          <DocumentProgressBar nombre="Revisión Técnica" fechaVencimiento={unidad.vencimiento_revision_tecnica} />
          <DocumentProgressBar nombre="Seguro Obligatorio" fechaVencimiento={unidad.vencimiento_seguro} />
        </div>
        <div className="flex gap-4 mt-4 text-[10px] text-dim">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green" /> &gt;30 días</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> ≤30 días</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red" /> Vencido</span>
        </div>
      </div>

      {/* Esquema de ejes */}
      <div className="px-8 pb-12">
        <h2 className="text-[11px] font-medium text-dim uppercase tracking-wide mb-4">Esquema de Ejes</h2>
        <div className="opacity-60 hover:opacity-100 transition-opacity">
          <ChasisPreview tipo={unidad.chasis || "2_ejes_6_ruedas"} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-8 text-center">
        <p className="text-[10px] text-dim font-mono">
          {unidad.id} · {unidad.creado_en ? new Date(unidad.creado_en.replace(' ', 'T')).toLocaleDateString("es-CL") : "—"}
        </p>
      </div>
    </div>
  );
}
