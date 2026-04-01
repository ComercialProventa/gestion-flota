"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import EditarUnidadForm from "./editar-unidad-form";
import { getUnidadById } from "../../actions";

export default function EditarUnidadClient({ id }: { id: string }) {
  const { data: unidad, isLoading, isError, error } = useQuery({
    queryKey: ["unidad", id],
    queryFn: () => getUnidadById(id),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <div className="px-8 pt-10 text-dim text-[13px]">Cargando unidad...</div>;
  }

  if (isError || !unidad) {
    return <div className="px-8 pt-10 text-red text-[13px]">Error: {error?.message || "No encontrada"}</div>;
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-8 pt-10 pb-6">
        <Link href="/admin/flota" className="text-dim hover:text-foreground transition-colors text-[13px]">
          ← Volver
        </Link>
        <h1 className="text-[22px] font-bold text-foreground tracking-tight">Editar Unidad</h1>
        <span className="text-[13px] font-mono text-accent uppercase">{unidad.patente}</span>
      </div>

      {/* Formulario */}
      <div className="px-8 pb-12">
        <EditarUnidadForm unidad={unidad} />
      </div>
    </div>
  );
}
