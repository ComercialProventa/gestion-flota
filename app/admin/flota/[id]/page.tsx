import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UnidadDetalleClient from "./unidad-detalle-client";

export const metadata: Metadata = {
  title: "Detalle de Unidad | Maestro de Flota",
};

export default async function UnidadDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  return <UnidadDetalleClient id={id} />;
}
