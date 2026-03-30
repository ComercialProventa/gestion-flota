import type { Metadata } from "next";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "Operaciones | ProVenta",
};

export default function OperacionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
