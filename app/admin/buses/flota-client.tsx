"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getBuses } from "./actions";
import ChasisPreview from "@/components/buses/chasis-preview";
import DocumentProgressBar from "@/components/ui/DocumentProgressBar";

export default function FlotaClient() {
    // TanStack Query asume el control total
    const { data: buses, isLoading, isError, error } = useQuery({
        queryKey: ["buses"],
        queryFn: getBuses,
        // La data vive en memoria sin recargarse por 5 minutos
        staleTime: 1000 * 60 * 5,
    });

    const flota = buses || [];

    // Manejo de Error
    if (isError) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-red-400">Error: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Header (Siempre visible, incluso al cargar) */}
            <header className="sticky top-0 z-10 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin"
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-white">Flota de Buses</h1>
                            <p className="text-xs text-slate-400">
                                {isLoading ? "Cargando registros..." : `${flota.length} ${flota.length === 1 ? "bus" : "buses"} registrados`}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/buses/nuevo"
                        className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-500 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Nuevo Bus
                    </Link>
                </div>
            </header>

            {/* Contenido */}
            <main className="mx-auto max-w-5xl px-4 py-6">
                {isLoading ? (
                    // SKELETON: Diseño de carga para el primer acceso (solo dura milisegundos)
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-64 rounded-2xl border border-white/5 bg-[#121214]"></div>
                        ))}
                    </div>
                ) : flota.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Sin buses registrados</h3>
                        <p className="text-sm text-slate-400 mb-6">Registra tu primer bus para comenzar.</p>
                        <Link
                            href="/admin/buses/nuevo"
                            className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition-colors"
                        >
                            Registrar Primer Bus
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {flota.map((bus) => (
                            <Link
                                key={bus.id}
                                href={`/admin/buses/${bus.id}`}
                                className="block rounded-2xl border border-white/5 bg-[#121214] p-5 transition-all hover:border-sky-500/30 hover:bg-[#1a1a1c] group"
                            >
                                {/* Header de la card */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-mono text-lg font-bold text-white tracking-wider group-hover:text-sky-400 transition-colors">
                                            {bus.patente}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            {bus.marca} {bus.modelo} · {bus.ano}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 border border-white/5">
                                        {bus.asientos} asientos
                                    </span>
                                </div>

                                {/* Previsualización del chasis en miniatura */}
                                <div className="rounded-xl bg-[#0a0a0a] p-3 mb-4 overflow-x-auto border border-white/5">
                                    <ChasisPreview tipo={bus.chasis || "estandar_6"} compact />
                                </div>

                                {/* Barras de progreso de vigencia */}
                                <div className="space-y-3">
                                    <DocumentProgressBar
                                        nombre="Revisión Técnica"
                                        fechaVencimiento={bus.vencimiento_revision_tecnica}
                                    />
                                    <DocumentProgressBar
                                        nombre="Seguro Obligatorio"
                                        fechaVencimiento={bus.vencimiento_seguro}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}