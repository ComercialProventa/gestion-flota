import type { Metadata } from "next";
import CombustibleCliente from "./combustible-cliente";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Combustible | ProVenta Ops",
};

export default function CombustiblePage() {
  return (
    <CombustibleCliente />
  );
}
