import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BusDetalleClient from "./bus-detalle-client";

export const metadata: Metadata = {
  title: "Detalle del Vehículo | Administración",
  description: "Ficha detallada del vehículo con vigencias legales",
};

export default async function BusDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  return <BusDetalleClient id={id} />;
}
