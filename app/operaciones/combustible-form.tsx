"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { obtenerUltimoKilometraje, registrarCargaCombustible } from "./actions";

type Bus = { id: string; patente: string; foto_url?: string | null; capacidad_estanque?: number | null };

export default function CombustibleForm({ buses }: { buses: Bus[] }) {
  const [busId, setBusId] = useState("");
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [litros, setLitros] = useState("");

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
  const formularioValido = busId !== "" && fecha !== "" && hora !== "" && !isNaN(kmActual) && kmActual > 0 && !isNaN(parseFloat(litros)) && parseFloat(litros) > 0 && !hardBlockActivo;

  async function handleSubmit(formData: FormData) {
    if (!busId) return;
    formData.set("bus_id", busId); // Ensure busId is appended

    setLoading(true); setError(null); setExito(null);
    const result = await registrarCargaCombustible(formData);
    if (result.error) { setError(result.error); }
    else if (result.success) {
      setExito(result.mensaje!);
      setBusId(""); setKilometraje(""); setLitros(""); setUltimoKm(null);
      const ahora = new Date();
      setFecha(ahora.toLocaleDateString("en-CA"));
      setHora(ahora.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false }));
    }
    setLoading(false);
  }

  const inputCls = "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-[14px] text-white placeholder-white/20 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition-colors";

  const selectedBus = buses.find(b => b.id === busId);

  return (
    <>
      <form action={handleSubmit} className="space-y-4">
        {exito && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2.5 text-[13px] font-medium text-emerald-400">
            ✓ {exito}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-[13px] font-medium text-red-400">
            ✕ {error}
          </div>
        )}

        {/* ─── Selector de Bus (Botón en vez de Select) ─── */}
        <div>
          <label className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Bus</label>
          <button
            type="button"
            onClick={() => setSelectorAbierto(true)}
            className="w-full flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 hover:bg-white/[0.06] active:scale-[0.98] transition-all"
          >
            {selectedBus ? (
              <div className="flex items-center gap-3">
                {selectedBus.foto_url ? (
                  <div className="h-10 w-10 relative rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <Image src={selectedBus.foto_url} alt={selectedBus.patente} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                )}
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[15px] font-semibold tracking-wider text-white">
                    {selectedBus.patente}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-[14px] text-white/40 font-medium px-1">Tocar para buscar bus...</span>
            )}
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/[0.05] text-white/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>

        {/* ─── Resto del Formulario (Fecha, Hora, etc) ─── */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="fecha" className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Fecha</label>
            <input id="fecha" name="fecha" type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="hora" className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Hora</label>
            <input id="hora" name="hora" type="time" required value={hora} onChange={(e) => setHora(e.target.value)} className={inputCls} />
          </div>
        </div>

        {busId && (
          <div>
            <label className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Último KM</label>
            <div className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[14px] font-mono text-white/50">
              {cargandoKm ? "Cargando..." : ultimoKm === 0 ? "Sin registros" : `${ultimoKm?.toLocaleString("es-CL")} km`}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="kilometraje" className="block text-[12px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">KM Actual</label>
          <input
            id="kilometraje" name="kilometraje" type="number" required min={1} placeholder="125400"
            value={kilometraje} onChange={(e) => setKilometraje(e.target.value)}
            className={`${inputCls} font-mono ${hardBlockActivo ? "!border-red-500/50 !bg-red-500/[0.06]" : ""}`}
          />
          {hardBlockActivo && (
            <p className="mt-1.5 text-[12px] text-red-400/80">
              ⚠ Debe ser mayor a {ultimoKm?.toLocaleString("es-CL")} km
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="litros_cargados" className="block text-[12px] font-medium text-white/40 uppercase tracking-wider">Litros</label>
            {selectedBus?.capacidad_estanque && (
              <span className="text-[11px] font-semibold text-emerald-500/80 tracking-wide">
                Tanque: <span className="text-white/60">{selectedBus.capacidad_estanque} L</span>
              </span>
            )}
          </div>
          <input
            id="litros_cargados" name="litros_cargados" type="number" required min={0.1} step={0.1} placeholder="45.5"
            value={litros} onChange={(e) => setLitros(e.target.value)}
            className={`${inputCls} font-mono`}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !formularioValido}
          className="w-full rounded-xl bg-amber-500 px-4 py-3.5 mt-2 text-[15px] font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer"
        >
          {loading ? "Registrando..." : "Registrar Carga"}
        </button>
      </form>

      {/* ═══════════════════════════════════════════════════════
          MODAL: SELECCIONAR BUS
          ═══════════════════════════════════════════════════════ */}
      {selectorAbierto && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-xl">
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06] bg-[#1c1c1e]/60">
            <div>
              <h3 className="text-[17px] font-bold text-white tracking-tight">Seleccionar Bus</h3>
              <p className="text-[12px] text-white/40">Buses asignados a ti</p>
            </div>
            <button
              onClick={() => setSelectorAbierto(false)}
              className="flex items-center justify-center p-2 rounded-full bg-white/10 text-white/60 active:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {buses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-white/40 text-sm">No tienes buses asignados.</p>
                <p className="text-white/20 text-xs mt-1">Pídale al administrador que le asigne uno.</p>
              </div>
            ) : (
              buses.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBusId(b.id);
                    setSelectorAbierto(false);
                  }}
                  className="w-full flex items-center gap-3 rounded-xl bg-[#1c1c1e] border border-white/[0.06] p-2.5 text-left active:scale-[0.97] transition-all"
                >
                  {b.foto_url ? (
                    <div className="h-10 w-10 shrink-0 relative rounded-lg overflow-hidden border border-white/10 bg-black/50">
                      <Image src={b.foto_url} alt={b.patente} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center border border-white/10 bg-white/5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-[15px] font-bold tracking-widest text-white">{b.patente}</p>
                    <p className="text-[10px] text-amber-500/80 uppercase font-semibold tracking-wider">Flota Activa</p>
                  </div>
                  <div className="text-white/20 px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
