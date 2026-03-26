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
      {/* ─── BOTÓN DISPARADOR (COMPACTO PERO AGRESIVO: h-16) ─── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between h-16 border-2 border-dashed border-emerald-500/50 bg-emerald-500/10 rounded-sm px-4 active:bg-emerald-500/20 transition-all shrink-0"
      >
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <span className="text-[18px] sm:text-xl font-black uppercase text-emerald-400 tracking-tighter">BODEGA TALLER</span>
        </div>

        {/* Marcador de Stock */}
        <div className="flex items-end gap-1.5 bg-black border border-white/10 rounded-sm px-3 py-1">
          <span className="font-mono text-2xl font-black text-white leading-none">{stock.length}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-0.5">UDS</span>
        </div>
      </button>

      {/* ─── MODAL PANTALLA COMPLETA ─── */}
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col bg-[#050505] animate-in slide-in-from-bottom-4 duration-200">

          {/* Cabecera Fija (Espacio optimizado) */}
          <div className="flex items-center justify-between p-4 border-b-2 border-white/10 bg-black shrink-0">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">STOCK DISPONIBLE</h2>
              <p className="text-[11px] text-emerald-400 font-black uppercase tracking-widest mt-1.5">{stock.length} LISTOS PARA INSTALAR</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-12 w-12 flex items-center justify-center rounded-sm border-2 border-white/20 bg-[#121214] text-white cursor-pointer active:bg-white/10 transition-colors"
            >
              <span className="text-2xl font-black">X</span>
            </button>
          </div>

          {/* Buscador Fijo (h-14 para dedos grandes, sin bordes inútiles) */}
          <div className="p-3 border-b-2 border-white/10 bg-[#0a0a0a] shrink-0">
            <input
              type="text"
              placeholder="BUSCAR CÓDIGO O MARCA..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
              className="w-full h-14 rounded-sm border-2 border-white/20 bg-black px-4 font-mono text-xl font-black text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition-colors uppercase"
            />
          </div>

          {/* Listado de Stock (Scrollable, tarjetas densas) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#050505]">
            {stockFiltrado.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-700 pb-20">
                <span className="text-6xl font-black">?</span>
                <span className="text-xl font-black uppercase tracking-widest mt-2">SIN RESULTADOS</span>
              </div>
            ) : (
              <div className="space-y-3 pb-6">
                {stockFiltrado.map((n) => (
                  // TARJETA DE NEUMÁTICO (Compacta pero con letras grandes)
                  <div key={n.id} className="flex flex-col rounded-sm border-2 border-emerald-500/30 bg-[#101010] p-4">

                    {/* Fila Superior: Código y Estado */}
                    <div className="flex items-center justify-between border-b-2 border-white/10 pb-3 mb-3">
                      <span className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tighter bg-black px-3 py-1 rounded-sm border border-white/10 leading-none">
                        {n.codigo_unico}
                      </span>
                      <div className={`px-3 py-1.5 rounded-sm border text-[11px] font-black uppercase tracking-widest ${n.ciclo_vida === 'nuevo'
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                        {n.ciclo_vida.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Detalles Técnicos */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col border-l-4 border-white/10 pl-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">MARCA</span>
                        <span className="font-black text-xl text-white uppercase leading-none">{n.modelos_neumaticos?.marca || "N/A"}</span>
                      </div>
                      <div className="flex flex-col border-l-4 border-white/10 pl-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">MEDIDA</span>
                        <span className="font-black text-xl text-white uppercase leading-none">{n.modelos_neumaticos?.medida || "N/A"}</span>
                      </div>
                    </div>

                    {/* Info Secundaria (Serie/Resp) */}
                    <div className="mt-4 pt-3 text-[11px] text-slate-500 flex items-center justify-between border-t border-white/10 font-black uppercase tracking-widest">
                      <span className="font-mono text-slate-400">SERIE: {n.numero_serie || "S/N"}</span>
                      <span>
                        {n.usuarios ? (
                          <>RESP: <span className="text-slate-300">{n.usuarios.nombre_completo.split(' ')[0]}</span></>
                        ) : (
                          <span className="italic text-slate-600">SISTEMA</span>
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