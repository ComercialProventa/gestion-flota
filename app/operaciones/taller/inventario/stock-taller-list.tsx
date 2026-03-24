"use client";

import { useMemo, useState } from "react";

export type NeumaticoStock = {
  id: string;
  codigo_unico: string;
  numero_serie: string | null;
  codigo_dot: string | null;
  ciclo_vida: string;
  creado_en: string;
  modelos_neumaticos: {
    marca: string;
    medida: string;
  };
  usuarios: {
    nombre_completo: string;
  } | null;
};

export default function StockTallerList({ stock }: { stock: NeumaticoStock[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const stockFiltrado = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return stock;
    return stock.filter(
      (n) =>
        n.codigo_unico.toLowerCase().includes(q) ||
        (n.numero_serie && n.numero_serie.toLowerCase().includes(q)) ||
        n.modelos_neumaticos?.marca.toLowerCase().includes(q) ||
        n.modelos_neumaticos?.medida.toLowerCase().includes(q)
    );
  }, [stock, busqueda]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        Bodega ({stock.length})
      </button>

      {/* Drawer Fullscreen */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50 sticky top-0 z-10">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Stock en Bodega</h2>
              <p className="text-[12px] text-emerald-400 font-medium">{stock.length} listos para instalar</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 text-white cursor-pointer hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 border-b border-white/10 bg-slate-900/50">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por código, serie o marca..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full rounded-2xl border border-slate-600 bg-black/40 py-3.5 pl-10 pr-4 text-[15px] text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-6">
            {stockFiltrado.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <p className="text-[15px]">No se encontraron resultados.</p>
              </div>
            ) : (
                <div className="space-y-2 mt-4">
                  {stockFiltrado.map((n) => (
                    <div key={n.id} className="flex flex-col gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-sm font-bold text-white bg-black/50 px-2.5 py-1 rounded-md border border-white/10">
                            {n.codigo_unico}
                          </span>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider ${
                          n.ciclo_vida === 'nuevo' 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {n.ciclo_vida.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="mt-1">
                        <div className="font-semibold text-[15px] text-white">{n.modelos_neumaticos?.marca || "Desconocida"}</div>
                        <div className="text-[13px] text-slate-400">{n.modelos_neumaticos?.medida || ""}</div>
                      </div>

                      <div className="mt-2 text-[12px] text-slate-500 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="font-mono">Serie: {n.numero_serie || "S/N"}</span>
                        <span>
                          {n.usuarios ? (
                            <>Resp: <span className="text-slate-400">{n.usuarios.nombre_completo.split(' ')[0]}</span></>
                          ) : (
                            <span className="italic">Sistema</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
