"use client";

import { useState } from "react";
import {
  ejecutarReemplazoNeumatico,
  type NeumaticoInventario,
  type ModeloNeumatico,
  type Neumatico,
} from "./actions";

const LABEL_POSICION: Record<string, string> = {
  delantero_izquierdo: "DEL. IZQ",
  delantero_derecho: "DEL. DER",
  trasero_exterior_izquierdo: "EXT. IZQ",
  trasero_interior_izquierdo: "INT. IZQ",
  trasero_interior_derecho: "INT. DER",
  trasero_exterior_derecho: "EXT. DER",
  trasero2_exterior_izquierdo: "T2 EXT. IZQ",
  trasero2_interior_izquierdo: "T2 INT. IZQ",
  trasero2_interior_derecho: "T2 INT. DER",
  trasero2_exterior_derecho: "T2 EXT. DER",
};

type TabActivo = "inventario" | "compra_directa";

export default function ModalReemplazo({
  busId,
  posicion,
  neumaticoViejo,
  inventario,
  modelos,
  ultimoKm,
  onCerrar,
  onExito,
}: {
  busId: string;
  posicion: string;
  neumaticoViejo: Neumatico | null;
  inventario: NeumaticoInventario[];
  modelos: ModeloNeumatico[];
  ultimoKm: number;
  onCerrar: () => void;
  onExito: (msg: string) => void;
}) {
  const [tab, setTab] = useState<TabActivo>("inventario");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tab 1 state
  const [neumaticoInvId, setNeumaticoInvId] = useState("");

  // Tab 2 state
  const [modeloId, setModeloId] = useState("");
  const [factura, setFactura] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [precio, setPrecio] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [dot, setDot] = useState("");
  const [cicloVida, setCicloVida] = useState("nuevo");

  // Shared
  const [km, setKm] = useState("");

  const esReemplazo = neumaticoViejo !== null;

  async function handleConfirmar() {
    const kmNum = parseInt(km, 10);
    if (isNaN(kmNum) || kmNum <= 0) { setError("KILOMETRAJE INVÁLIDO"); return; }
    if (kmNum < ultimoKm) { setError(`DEBE SER MAYOR A ${ultimoKm.toLocaleString("es-CL")} KM`); return; }

    if (tab === "inventario" && !neumaticoInvId) { setError("SELECCIONE UN NEUMÁTICO DE BODEGA"); return; }
    if (tab === "compra_directa" && !modeloId) { setError("SELECCIONE UN MODELO DE COMPRA"); return; }

    setLoading(true);
    setError(null);

    const result = await ejecutarReemplazoNeumatico({
      busId,
      posicion,
      kilometrajeMomento: kmNum,
      neumaticoViejoId: neumaticoViejo?.id || null,
      modo: tab,
      neumaticoInventarioId: tab === "inventario" ? neumaticoInvId : null,
      modeloId: tab === "compra_directa" ? modeloId : null,
      factura: tab === "compra_directa" ? factura : null,
      proveedor: tab === "compra_directa" ? proveedor : null,
      precio: tab === "compra_directa" && precio ? parseInt(precio, 10) : 0,
      numeroSerie: tab === "compra_directa" ? numeroSerie : null,
      codigoDot: tab === "compra_directa" ? dot : null,
      cicloVida: tab === "compra_directa" ? cicloVida : null,
    });

    setLoading(false);

    if (result.error) setError(result.error);
    else onExito(result.mensaje!);
  }

  // ─── CLASES INDUSTRIALES (INPUTS GIGANTES) ───
  // h-16 (64px) de alto, texto en 20px (text-xl), mayúsculas obligatorias.
  const inputUI = "w-full h-16 rounded-sm border-2 border-white/20 bg-[#0a0a0a] px-4 font-mono text-xl font-black text-white focus:border-sky-500 focus:outline-none transition-colors uppercase placeholder:text-white/20";

  return (
    <div className="fixed inset-0 z-[110] bg-[#050505] flex flex-col animate-in slide-in-from-bottom-4 duration-300">

      {/* ─── CABECERA FIJA ─── */}
      <div className={`p-5 border-b-4 flex items-center justify-between ${esReemplazo ? 'border-amber-500 bg-amber-500/10' : 'border-emerald-500 bg-emerald-500/10'}`}>
        <div>
          <h2 className={`text-2xl font-black uppercase tracking-tighter ${esReemplazo ? 'text-amber-500' : 'text-emerald-500'}`}>
            {esReemplazo ? "REEMPLAZAR" : "INSTALAR"}
          </h2>
          <p className="text-[12px] font-black text-white tracking-widest mt-1">
            POSICIÓN: {LABEL_POSICION[posicion]}
          </p>
        </div>
        <button onClick={onCerrar} className="h-14 w-14 flex items-center justify-center border-2 border-white/20 bg-black text-white font-bold rounded-sm active:bg-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* ─── SCROLLABLE CONTENT ─── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">

        {/* Info del neumático saliente */}
        {esReemplazo && (
          <div className="rounded-sm border-2 border-red-500 bg-red-500/10 p-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Neumático Saliente</span>
              <span className="font-mono text-2xl font-black text-white">{neumaticoViejo!.codigo_unico}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Uso Acumulado</span>
              <span className="font-mono text-xl font-bold text-white block">{(neumaticoViejo!.desgaste_acumulado_km || 0).toLocaleString()} KM</span>
            </div>
          </div>
        )}

        {/* ─── TABS DE ORIGEN ─── */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setTab("inventario"); setError(null); }}
            className={`flex-1 h-16 rounded-sm border-2 text-[14px] font-black uppercase tracking-[0.1em] transition-colors ${tab === "inventario" ? "bg-sky-600 border-sky-500 text-white" : "border-white/10 text-slate-500 bg-[#121214]"}`}
          >
            BODEGA
          </button>
          <button
            type="button"
            onClick={() => { setTab("compra_directa"); setError(null); }}
            className={`flex-1 h-16 rounded-sm border-2 text-[14px] font-black uppercase tracking-[0.1em] transition-colors ${tab === "compra_directa" ? "bg-sky-600 border-sky-500 text-white" : "border-white/10 text-slate-500 bg-[#121214]"}`}
          >
            COMPRA DIRECTA
          </button>
        </div>

        {/* ─── FORMULARIO DINÁMICO ─── */}
        <div className="space-y-4 bg-white/5 border border-white/10 p-4 rounded-sm">
          <p className="text-[12px] font-black text-sky-400 uppercase tracking-widest">01. DATOS NEUMÁTICO NUEVO</p>

          {tab === "inventario" ? (
            <div>
              <select value={neumaticoInvId} onChange={(e) => setNeumaticoInvId(e.target.value)} className={`${inputUI} h-20 text-2xl`}>
                <option value="">-- SELECCIONAR STOCK --</option>
                {inventario.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.codigo_unico} | {n.modelo_marca}
                  </option>
                ))}
              </select>
              {inventario.length === 0 && <p className="mt-2 text-[12px] font-bold text-red-400 uppercase">⚠ BODEGA VACÍA</p>}
            </div>
          ) : (
            <div className="space-y-4">
              <select value={modeloId} onChange={(e) => setModeloId(e.target.value)} className={inputUI}>
                <option value="">-- SELECCIONAR MODELO --</option>
                {modelos.map((m) => (
                  <option key={m.id} value={m.id}>{m.marca} - {m.medida}</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)} placeholder="N° SERIE *" className={inputUI} />
                <input type="text" inputMode="numeric" maxLength={4} value={dot} onChange={(e) => setDot(e.target.value.replace(/\D/g, ''))} placeholder="DOT *" className={inputUI} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={factura} onChange={(e) => setFactura(e.target.value)} placeholder="FACTURA" className={inputUI} />
                <input type="number" inputMode="numeric" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="PRECIO $" className={inputUI} />
              </div>

              <input type="text" value={proveedor} onChange={(e) => setProveedor(e.target.value)} placeholder="PROVEEDOR" className={inputUI} />

              <select value={cicloVida} onChange={(e) => setCicloVida(e.target.value)} className={inputUI}>
                <option value="nuevo">NUEVO</option>
                <option value="recapado_1">RECAPADO 1</option>
                <option value="recapado_2">RECAPADO 2</option>
                <option value="recapado_3">RECAPADO 3</option>
              </select>
            </div>
          )}
        </div>

        {/* ─── KILOMETRAJE (GIGANTE) EN MODAL-REEMPLAZO.TSX ─── */}
        <div className="space-y-2 pt-2">
          <label className="text-[14px] font-black text-slate-400 uppercase tracking-widest">
            02. ODÓMETRO DEL BUS (KM) *
          </label>
          <input
            type="tel"
            inputMode="numeric"
            min={1}
            value={km}
            onChange={(e) => setKm(e.target.value)}
            placeholder={`${ultimoKm.toLocaleString()} KM`}
            className={`w-full h-28 text-center rounded-sm border-4 bg-black font-mono text-[60px] sm:text-[80px] leading-none font-black text-white focus:outline-none transition-colors ${error && error.includes("MAYOR") ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-white/20 focus:border-sky-500'}`}
          />
          {ultimoKm > 0 && <p className="text-[12px] font-bold text-amber-500 uppercase tracking-widest text-center mt-2">ANTERIOR: {ultimoKm.toLocaleString()} KM</p>}
        </div>
        {/* MENSAJE DE ERROR CENTRAL */}
        {error && (
          <div className="border-4 border-red-500 bg-red-500/10 p-4 text-center rounded-sm mt-4">
            <span className="text-[14px] font-black text-red-500 uppercase tracking-widest">⚠ {error}</span>
          </div>
        )}
      </div>

      {/* ─── FOOTER FIJO (BOTÓN DE EJECUCIÓN) ─── */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#050505] border-t-4 border-white/10">
        <button
          type="button"
          onClick={handleConfirmar}
          disabled={loading || !km || (tab === "inventario" ? !neumaticoInvId : (!modeloId || !numeroSerie || dot.length !== 4))}
          className={`w-full h-24 rounded-sm text-[18px] font-black uppercase tracking-[0.3em] transition-all disabled:opacity-20 disabled:grayscale ${esReemplazo ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.2)]'
            }`}
        >
          {loading ? "PROCESANDO..." : esReemplazo ? "CONFIRMAR REEMPLAZO" : "CONFIRMAR INSTALACIÓN"}
        </button>
      </div>

    </div>
  );
}