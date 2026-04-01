"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getBuses } from "./actions"; // ✅ Importación nombrada (Correcto)
import FlotaLista from "./flota-lista";
import LoadingFlota from "./loading"; // Usaremos tu propio componente de carga

export default function FlotaClient() {
    // 1. React Query toma el control
    const { data: unidades, isLoading, isError, error } = useQuery({
        queryKey: ["flota"], // Cambié la llave a "flota" para que coincida con la sección
        queryFn: getBuses,
        staleTime: 1000 * 60 * 5, // 5 minutos de memoria caché instantánea
    });

    const flota = unidades || [];

    // Manejo de error de red o base de datos
    if (isError) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="rounded border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                    Error al cargar la flota: {error.message}
                </div>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
            {/* Encabezado de Sección */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-default pb-5">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground">Maestro de Flota</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        {isLoading ? "Cargando unidades..." : `${flota.length} unidades registradas`}
                    </p>
                </div>

                <Link
                    href="/admin/flota/nuevo"
                    className="flex items-center justify-center gap-2 rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nueva Unidad
                </Link>
            </div>

            {/* Contenido Principal manejado por React Query */}
            {isLoading ? (
                // Muestra tu componente de carga mientras React Query hace el fetch inicial
                <LoadingFlota isNested={true} />
            ) : flota.length === 0 ? (
                // Estado vacío
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-xl border border-dashed border-border-strong bg-surface-card">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-overlay text-zinc-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-medium text-zinc-300">No hay unidades registradas</h3>
                    <p className="mt-1 text-xs text-zinc-500 mb-6">Comienza agregando el primer bus o camión a la flota.</p>
                    <Link href="/admin/flota/nuevo" className="rounded-lg bg-surface-overlay px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-raised transition-colors border border-border-default">
                        Registrar Unidad
                    </Link>
                </div>
            ) : (
                // Si hay datos, renderiza tu componente de lista pasando los datos
                <FlotaLista unidades={flota} />
            )}
        </main>
    );
}