"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getModelos } from "./actions";
import EliminarModeloBtn from "./eliminar-modelo-btn";

export type ModeloNeumatico = {
    id: string;
    marca: string;
    medida: string;
    aplicacion_eje: string;
    vida_util_km: number;
    creado_en: string;
};

export default function ListaModelos() {
    const { data: modelos, isLoading } = useQuery({
        queryKey: ["modelos_neumaticos"],
        queryFn: getModelos,
        staleTime: 1000 * 60 * 10,
    });

    const [busqueda, setBusqueda] = useState("");
    const [orden, setOrden] = useState<"recientes" | "antiguos" | "marca">("recientes");

    const modelosIniciales = modelos || [];

    const modelosProcesados = useMemo(() => {
        let resultado = [...modelosIniciales];
        if (busqueda.trim() !== "") {
            const q = busqueda.toLowerCase();
            resultado = resultado.filter(
                (m) =>
                    m.marca.toLowerCase().includes(q) ||
                    m.medida.toLowerCase().includes(q) ||
                    m.aplicacion_eje.toLowerCase().includes(q)
            );
        }

        return resultado.sort((a, b) => {
            const fechaA = new Date(a.creado_en).getTime();
            const fechaB = new Date(b.creado_en).getTime();

            if (orden === "recientes") return fechaB - fechaA;
            if (orden === "antiguos") return fechaA - fechaB;
            if (orden === "marca") return a.marca.localeCompare(b.marca);
            return 0;
        });
    }, [modelosIniciales, busqueda, orden]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-dim">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4"></div>
                <p className="text-sm font-medium animate-pulse">Sincronizando catálogo con Supabase...</p>
            </div>
        );
    }

    const inputClasses = "rounded-md bg-surface px-3 py-2 text-[13px] text-foreground placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-accent/30";

    return (
        <div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:max-w-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-dim">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar marca, medida o eje..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className={`${inputClasses} w-full pl-9`}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="text-[11px] font-medium text-dim whitespace-nowrap">
                        Ordenar por:
                    </label>
                    <select
                        value={orden}
                        onChange={(e) => setOrden(e.target.value as any)}
                        className={`${inputClasses} w-full sm:w-auto cursor-pointer`}
                    >
                        <option value="recientes">Más Recientes</option>
                        <option value="antiguos">Más Antiguos</option>
                        <option value="marca">Marca (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-medium text-dim uppercase tracking-wide">
                    <div className="col-span-3">Fabricante & Medida</div>
                    <div className="col-span-3">Aplicación</div>
                    <div className="col-span-2">Vida Útil</div>
                    <div className="col-span-2">Registro</div>
                    <div className="col-span-2 text-right">Acciones</div>
                </div>
                <div className="divide-y divide-divider">
                    {modelosProcesados.length === 0 ? (
                        <div className="py-12 text-center text-dim text-[13px]">
                            No se encontraron modelos registrados.
                        </div>
                    ) : (
                        modelosProcesados.map((m) => {
                            const fechaFormat = new Date(m.creado_en).toLocaleDateString("es-CL", {
                                day: "2-digit", month: "short", year: "numeric"
                            });

                            return (
                                <div key={m.id} className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 px-4 py-3 hover:bg-surface transition-colors group">
                                    <div className="md:col-span-3">
                                        <span className="text-[13px] font-medium text-foreground">{m.marca}</span>
                                        <span className="font-mono text-[11px] text-accent ml-2">{m.medida}</span>
                                    </div>
                                    <div className="hidden md:block md:col-span-3">
                                        <span className="text-[12px] text-dim uppercase">{m.aplicacion_eje}</span>
                                    </div>
                                    <div className="hidden md:block md:col-span-2">
                                        <span className="text-[12px] font-mono text-foreground">{m.vida_util_km.toLocaleString("es-CL")} km</span>
                                    </div>
                                    <div className="hidden md:block md:col-span-2">
                                        <span className="text-[12px] text-dim">{fechaFormat}</span>
                                    </div>
                                    <div className="md:col-span-2 flex md:justify-end mt-1 md:mt-0">
                                        <EliminarModeloBtn modeloId={m.id} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="px-4 py-3 text-[11px] text-dim">{modelosProcesados.length} modelos</div>
        </div>
    );
}
