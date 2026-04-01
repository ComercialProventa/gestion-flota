"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getBuses } from "./actions";
import FlotaLista from "./flota-lista";
import LoadingFlota from "./loading";

export default function FlotaClient() {
    const { data: unidades, isLoading, isError, error } = useQuery({
        queryKey: ["flota"],
        queryFn: getBuses,
        staleTime: 1000 * 60 * 5,
    });

    const flota = unidades || [];

    if (isError) {
        return (
            <div className="px-8 py-8">
                <div className="text-red-400">
                    Error al cargar la flota: {error.message}
                </div>
            </div>
        );
    }

    return (
        <main className="px-8 pb-12">
            <header className="pt-10 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-[22px] font-bold tracking-tight text-foreground">Maestro de Flota</h1>
                        <p className="text-[13px] text-muted mt-0.5">
                            {isLoading ? "Cargando unidades..." : `${flota.length} unidades registradas`}
                        </p>
                    </div>

                    <Link
                        href="/admin/flota/nuevo"
                        className="text-[13px] font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                        + Nueva unidad
                    </Link>
                </div>
            </header>

            {isLoading ? (
                <LoadingFlota isNested={true} />
            ) : flota.length === 0 ? (
                <div className="py-20 text-center">
                    <h3 className="text-[13px] font-medium text-foreground">No hay unidades registradas</h3>
                    <p className="mt-1 text-[12px] text-muted mb-6">Comienza agregando el primer bus o camión a la flota.</p>
                    <Link href="/admin/flota/nuevo" className="text-[13px] font-medium text-accent hover:text-accent/80 transition-colors">
                        Registrar Unidad
                    </Link>
                </div>
            ) : (
                <FlotaLista unidades={flota} />
            )}
        </main>
    );
}
