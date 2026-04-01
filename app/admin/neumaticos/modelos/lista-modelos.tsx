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
        <section className="bg-surface rounded-md flex flex-col">

            {/* Toolbar */}
            <div className="border-b border-border p-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
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
                <table className="w-full text-left text-[13px]">
                    <thead className="border-b border-border text-[11px] font-medium text-dim uppercase tracking-wide">
                        <tr>
                            <th className="px-5 py-3">Fabricante & Medida</th>
                            <th className="px-5 py-3">Aplicación</th>
                            <th className="px-5 py-3">Vida Útil (KM)</th>
                            <th className="px-5 py-3">Registro</th>
                            <th className="px-5 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-divider">
                        {modelosProcesados.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-dim">
                                    No se encontraron modelos registrados.
                                </td>
                            </tr>
                        ) : (
                            modelosProcesados.map((m) => {
                                const fechaFormat = new Date(m.creado_en).toLocaleDateString("es-CL", {
                                    day: "2-digit", month: "short", year: "numeric"
                                });

                                return (
                                    <tr key={m.id} className="hover:bg-surface-hover transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <div className="font-medium text-foreground leading-tight">{m.marca}</div>
                                            <div className="font-mono text-[11px] text-accent mt-0.5">{m.medida}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-[11px] font-medium text-dim uppercase tracking-wide">
                                                {m.aplicacion_eje}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-sm text-foreground">
                                            {m.vida_util_km.toLocaleString("es-CL")}
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-dim">
                                            {fechaFormat}
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <EliminarModeloBtn modeloId={m.id} />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
