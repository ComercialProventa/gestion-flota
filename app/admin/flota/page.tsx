import type { Metadata } from "next";
import FlotaClient from "@/app/admin/flota/flota-client";

export const metadata: Metadata = {
  title: "Maestro de Flota | Administración",
};

export default function FlotaPage() {
  return (
    <div className="max-w-5xl">
      <FlotaClient />
    </div>
  );
}
