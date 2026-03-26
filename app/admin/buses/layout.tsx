import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Flota de Buses | Administración",
    description: "Vista general de todos los buses registrados en la flota",
};

export default function BusesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}