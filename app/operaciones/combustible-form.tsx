"use client";

import { useState, useEffect } from "react";
import { obtenerUltimoKilometraje, registrarCargaCombustible } from "./actions";

type Bus = { id: string; patente: string; foto_url?: string | null; capacidad_estanque?: number | null };

export default function CombustibleForm({ buses, userId }: { buses: Bus[]; userId?: string }) {
  const [busId, setBusId] = useState("");
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [litros, setLitros] = useState("");
  const [precio, setPrecio] = useState("");

  const [ultimoKm, setUltimoKm] = useState<number | null>(null);
  const [cargandoKm, setCargandoKm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  useEffect(() => {
    const ahora = new Date();
    setFecha(ahora.toLocaleDateString("en-CA"));
    setHora(ahora.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false }));
  }, []);

  useEffect(() => {
    if (!busId) { setUltimoKm(null); return; }
    setCargandoKm(true);
    obtenerUltimoKilometraje(busId)
      .then((km) => { setUltimoKm(km); setCargandoKm(false); })
      .catch(() => { setUltimoKm(0); setCargandoKm(false); });
  }, [busId]);

  const kmActual = parseInt(kilometraje, 10);
  const hardBlockActivo = ultimoKm !== null && !isNaN(kmActual) && kmActual > 0 && kmActual <= ultimoKm;

  // Validación estricta: si hay error de KM, el botón se apaga
  const formularioValido = busId !== "" && !isNaN(kmActual) && kmActual > (ultimoKm || 0) && !isNaN(parseFloat(litros)) && parseFloat(litros) > 0;

  async function handleSubmit(formData: FormData) {
    if (!busId) return;
    formData.set("bus_id", busId);

    setLoading(true); setError(null); setExito(null);
    const result = await registrarCargaCombustible(formData);
    if (result.error) { setError(result.error); }
    else if (result.success) {
      setExito(result.mensaje!);
      setBusId(""); setKilometraje(""); setLitros(""); setPrecio(""); setUltimoKm(null);
    }
    setLoading(false);
  }

  const selectedBus = buses.find(b => b.id === busId);

  return (
    <div className="animate-in fade-in duration-300">
      <form action={handleSubmit} className="space-y-7">

        {/* Notificaciones: Mensajes grandes y claros */}
        {exito && (
          <div className="rounded-sm border-2 border-emerald-500 bg-emerald-500/10 p-4 text-[14px] font-black text-emerald-400 uppercase tracking-widest text-center">
            ✓ {exito}
          </div>
        )}
        {error && (
          <div className="rounded-sm border-2 border-red-500 bg-red-500/10 p-4 text-[14px] font-black text-red-400 uppercase tracking-widest text-center">
            ✕ {error}
          </div>
        )}

        {/* 01. SELECCIÓN DE UNIDAD */}
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
            01. Seleccionar Unidad
          </label>
          <button
            type="button"
            onClick={() => setSelectorAbierto(true)}
            className={`w-full flex items-center justify-between rounded-sm border-2 p-5 transition-all active:scale-[0.98] ${selectedBus ? "border-amber-500 bg-amber-500/5" : "border-white/20 bg-white/5"
              }`}
          >
            <span className={`font-mono text-2xl font-black tracking-tighter uppercase ${selectedBus ? "text-white" : "text-slate-600"}`}>
              {selectedBus ? selectedBus.patente : "BUSCAR PATENTE..."}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* 02. KILOMETRAJE */}
        <div className="space-y-2">
          <div className="flex justify-between items-end px-1">
            <label className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500">
              02. KM Actual
            </label>
            {busId && (
              <span className={`text-[11px] font-mono font-bold uppercase ${cargandoKm ? "text-slate-600" : "text-amber-500/80"}`}>
                Anterior: {cargandoKm ? "Cargando..." : `${ultimoKm?.toLocaleString("es-CL")} KM`}
              </span>
            )}
          </div>
          <input
            name="kilometraje"
            type="number"
            inputMode="numeric"
            required
            placeholder="000.000"
            value={kilometraje}
            onChange={(e) => setKilometraje(e.target.value)}
            className={`w-full h-20 rounded-sm border-2 bg-transparent px-4 font-mono text-3xl font-black text-white focus:outline-none transition-colors ${hardBlockActivo ? "border-red-600 bg-red-600/20 text-red-500" : "border-white/20 focus:border-amber-500"
              }`}
          />
          {hardBlockActivo && (
            <div className="bg-red-600 p-2 rounded-sm mt-1">
              <p className="text-[10px] font-black text-white uppercase tracking-tighter text-center">
                ⚠ El kilometraje debe ser mayor al anterior
              </p>
            </div>
          )}
        </div>

        {/* 03. LITROS */}
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
            03. Litros Cargados
          </label>
          <input
            name="litros_cargados"
            type="number"
            inputMode="decimal"
            required
            step="0.1"
            placeholder="0.0"
            value={litros}
            onChange={(e) => setLitros(e.target.value)}
            className="w-full h-20 rounded-sm border-2 border-white/20 bg-transparent px-4 font-mono text-3xl font-black text-amber-500 focus:border-amber-500 focus:outline-none placeholder:text-amber-900/30"
          />
        </div>

        {/* 04. PRECIO TOTAL */}
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
            04. Total Pagado ($)
          </label>
          <input
            name="precio_total_pago"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full h-20 rounded-sm border-2 border-white/20 bg-transparent px-4 font-mono text-3xl font-black text-white focus:border-amber-500 focus:outline-none placeholder:text-slate-700"
          />
        </div>

        {/* BOTÓN FINAL DE IMPACTO */}
        <button
          type="submit"
          disabled={loading || !formularioValido}
          className="w-full h-24 rounded-sm bg-amber-500 text-black text-[18px] font-black uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(245,158,11,0.3)] active:scale-[0.95] disabled:opacity-10 disabled:grayscale transition-all mt-6"
        >
          {loading ? "PROCESANDO..." : "REGISTRAR CARGA"}
        </button>

        <input type="hidden" name="fecha" value={fecha} />
        <input type="hidden" name="hora" value={hora} />
      </form>

      {/* SELECTOR DE UNIDADES TÉCNICO */}
      {selectorAbierto && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black animate-in slide-in-from-bottom duration-300">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#050505]">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Unidades</h3>
            <button onClick={() => setSelectorAbierto(false)} className="h-14 w-14 flex items-center justify-center border-2 border-white/20 text-white font-bold">
              X
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {buses.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => { setBusId(b.id); setSelectorAbierto(false); }}
                className="w-full flex items-center justify-between border-2 border-white/5 bg-[#101010] p-6 active:bg-amber-500 active:text-black transition-colors group"
              >
                <span className="font-mono text-3xl font-black tracking-tighter uppercase group-active:text-black">{b.patente}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-20 group-active:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}