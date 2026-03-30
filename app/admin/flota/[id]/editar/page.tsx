import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditarUnidadClient from "./editar-unidad-client";

export const metadata: Metadata = {
  title: "Editar Unidad | Maestro de Flota",
};

export default async function EditarUnidadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  return <EditarUnidadClient id={id} />;
}
