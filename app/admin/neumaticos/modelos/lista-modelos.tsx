"use client";

import { useState, useMemo } from "react";
import EliminarModeloBtn from "./eliminar-modelo-btn";

type ModeloNeumatico = {
    id: string;
    marca: string;
    medida: string;
    aplicacion_eje: string;
    vida_util_km: number;
    creado_en: string; // <-- Actualizado al nombre de tu BD
};

export default function ListaModelos({ modelosIniciales }: { modelosIniciales: ModeloNeumatico[] }) {
    const [busqueda, setBusqueda] = useState("");
    const [orden, setOrden] = useState<"recientes" | "antiguos" | "marca">("recientes");

    // Lógica de Filtrado y Ordenamiento Instantáneo
    const modelosProcesados = useMemo(() => {
        // 1. Filtrar por búsqueda
        let resultado = modelosIniciales;
        if (busqueda.trim() !== "") {
            const q = busqueda.toLowerCase();
            resultado = resultado.filter(
                (m) =>
                    m.marca.toLowerCase().includes(q) ||
                    m.medida.toLowerCase().includes(q) ||
                    m.aplicacion_eje.toLowerCase().includes(q)
            );
        }

        // 2. Ordenar
        return resultado.sort((a, b) => {
            // Arreglamos el string antes de pasarlo a Date reemplazando espacio por 'T'
            const fechaA = new Date(a.creado_en.replace(' ', 'T')).getTime();
            const fechaB = new Date(b.creado_en.replace(' ', 'T')).getTime();

            if (orden === "recientes") {
                return fechaB - fechaA;
            }
            if (orden === "antiguos") {
                return fechaA - fechaB;
            }
            if (orden === "marca") {
                return a.marca.localeCompare(b.marca);
            }
            return 0;
        });
    }, [modelosIniciales, busqueda, orden]);

    // Clases CSS reutilizables para mantener el diseño consistente
    const inputClasses = "rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 focus:outline-none transition-colors";

    return (
        <section className="rounded border border-white/10 bg-[#151517] overflow-hidden shadow-sm flex flex-col">

            {/* Toolbar: Buscador y Filtros */}
            <div className="border-b border-white/5 bg-white/[0.02] p-4 flex flex-col sm:flex-row gap-3 justify-between items-center">

                {/* Buscador Rápido */}
                <div className="relative w-full sm:max-w-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
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

                {/* Ordenamiento */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap">
                        Ordenar por:
                    </label>
                    <select
                        value={orden}
                        onChange={(e) => setOrden(e.target.value as any)}
                        className={`${inputClasses} w-full sm:w-auto cursor-pointer`}
                    >
                        <option value="recientes" className="bg-slate-800">Más Recientes</option>
                        <option value="antiguos" className="bg-slate-800">Más Antiguos</option>
                        <option value="marca" className="bg-slate-800">Marca (A-Z)</option>
                    </select>
                </div>

            </div>

            {/* Tabla de Resultados */}
            {modelosProcesados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mb-3 h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-sm font-medium text-slate-300">
                        {modelosIniciales.length === 0 ? "No hay modelos registrados" : "No se encontraron coincidencias"}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-white/5 bg-black/20 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="px-5 py-3">Fabricante & Medida</th>
                                <th className="px-5 py-3">Aplicación</th>
                                <th className="px-5 py-3">Vida Útil</th>
                                <th className="px-5 py-3">Fecha Registro</th>
                                <th className="px-5 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {modelosProcesados.map((m) => {
                                // Arreglamos el string aquí también antes de formatearlo
                                const fechaFormat = new Date(m.creado_en.replace(' ', 'T')).toLocaleDateString("es-CL", {
                                    day: "2-digit", month: "short", year: "numeric"
                                });

                                return (
                                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <div className="font-medium text-white">{m.marca}</div>
                                            <div className="font-mono text-xs text-sky-400 mt-0.5">{m.medida}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center rounded bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-white/10 capitalize">
                                                {m.aplicacion_eje}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="font-mono text-sm text-slate-300">
                                                {m.vida_util_km.toLocaleString("es-CL")} <span className="text-slate-500 text-[10px]">KM</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-xs text-slate-400">{fechaFormat}</span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right opacity-50 group-hover:opacity-100 transition-opacity">
                                            <EliminarModeloBtn modeloId={m.id} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}