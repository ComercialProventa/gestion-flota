import type { Metadata } from "next";
import FlotaClient from "./flota-client";

export const metadata: Metadata = {
  title: "Flota de Buses | Administración",
  description: "Vista general de todos los buses registrados en la flota",
};

/**
 * Vista General de la Flota — Server Component.
 * * Actúa solo como un wrapper pasivo para la Metadata. 
 * No hacemos fetch aquí para no bloquear la navegación del router.
 */
export default function FlotaBusesPage() {
  return <FlotaClient />;
}