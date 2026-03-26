import type { Metadata } from "next";
import FlotaClient from "@/app/admin/flota/flota-client"; // Crearemos este archivo ahora

export const metadata: Metadata = {
  title: "Maestro de Flota | Administración",
};

export default function FlotaPage() {
  return <FlotaClient />;
}