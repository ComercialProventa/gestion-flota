"use client";

import { useState, useEffect } from "react";

type HistorialCarga = {
  id: string;
  fecha: string;
  hora: string;
  kilometraje: number;
  litros_cargados: number;
  buses: { patente: string } | null;
};

export default function HistorialConductor({ historial }: { historial: HistorialCarga[] }) {
  const [telefonoSupervisor, setTelefonoSupervisor] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [telefonoTemp, setTelefonoTemp] = useState("");

  useEffect(() => {
    const guardado = localStorage.getItem("proventa_supervisor_ws");
    if (guardado) setTelefonoSupervisor(guardado);
  }, []);

  function guardarTelefono() {
    let limpio = telefonoTemp.replace(/\D/g, "");
    if (!limpio.startsWith("569") && limpio.length === 8) limpio = "569" + limpio;
    else if (limpio.startsWith("9") && limpio.length === 9) limpio = "56" + limpio;

    localStorage.setItem("proventa_supervisor_ws", limpio);
    setTelefonoSupervisor(limpio);
    setModalAbierto(false);
  }

  const formatearFecha = (iso: string) => iso.split("-").reverse().join("/");
  const formatearHora = (hora: string) => hora.substring(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ─── CONTACTO DE SOPORTE (Estilo Barra de Estado) ─── */}
      <button
        onClick={() => { setTelefonoTemp(telefonoSupervisor); setModalAbierto(true); }}
        className="w-full flex items-center justify-between border-2 border-dashed border-white/10 p-4 rounded-sm active:bg-white/5 transition-colors"
      >
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Supervisor de Turno</span>
          <span className="font-mono text-lg font-bold text-white">
            {telefonoSupervisor ? `+${telefonoSupervisor}` : "NO CONFIGURADO"}
          </span>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-sm text-[10px] font-black uppercase text-white">
          {telefonoSupervisor ? "EDITAR" : "CONFIGURAR"}
        </div>
      </button>

      {/* ─── LISTADO DE CARGAS (Estilo Planilla de Ruta) ─── */}
      <div className="space-y-4">
        <h2 className="px-1 text-[12px] font-black uppercase tracking-[0.3em] text-amber-500/50">
          Últimos Movimientos
        </h2>

        {historial.length === 0 ? (
          <div className="py-20 text-center border-2 border-white/5 rounded-sm">
            <p className="text-[14px] font-bold text-slate-600 uppercase tracking-widest">Sin registros recientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {historial.map((carga) => (
              <div key={carga.id} className="relative flex flex-col border-2 border-white/5 bg-[#0e0e10] rounded-sm overflow-hidden">
                {/* Cabecera del Ticket */}
                <div className="flex items-center justify-between bg-white/[0.03] px-4 py-3 border-b border-white/5">
                  <span className="font-mono text-2xl font-black text-white tracking-tighter uppercase">
                    {carga.buses?.patente || "S.P"}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase">{formatearFecha(carga.fecha)}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase leading-none">{formatearHora(carga.hora)} HRS</p>
                  </div>
                </div>

                {/* Datos del Ticket */}
                <div className="flex items-center p-4 gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">Volumen Cargado</p>
                    <p className="font-mono text-2xl font-black text-amber-500 leading-none">
                      {carga.litros_cargados}<span className="text-xs ml-1">LTS</span>
                    </p>
                  </div>

                  <div className="w-[1px] h-10 bg-white/5" />

                  <div className="flex-1 space-y-1 text-right pr-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">Odómetro</p>
                    <p className="font-mono text-2xl font-black text-white leading-none tracking-tighter">
                      {carga.kilometraje.toLocaleString("es-CL")}<span className="text-xs ml-1">KM</span>
                    </p>
                  </div>

                  {/* Botón WhatsApp: El más grande para el pulgar */}
                  <a
                    href={`https://wa.me/${telefonoSupervisor}?text=${encodeURIComponent(`SOLICITO CORRECCIÓN:\nUnidad: ${carga.buses?.patente}\nFecha: ${formatearFecha(carga.fecha)}\nKM: ${carga.kilometraje}\nLTS: ${carga.litros_cargados}`)}`}
                    target="_blank"
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-sm transition-all active:scale-95 ${telefonoSupervisor
                        ? "bg-emerald-600 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        : "bg-white/5 text-slate-800 opacity-20 pointer-events-none"
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                      <path d="M12.031 21.033A8.956 8.956 0 014.28 17.22l-1.077 3.93 4.026-1.055a8.96 8.96 0 114.802 1.353v-.415zm0-16.14a7.18 7.18 0 100 14.36 7.18 7.18 0 000-14.36z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── MODAL INDUSTRIAL (Bordes rectos, inputs gigantes) ─── */}
      {modalAbierto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm border-2 border-white/10 bg-[#050505] p-8 rounded-sm">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Soporte Directo</h3>
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-8">
              Ingrese el número de WhatsApp del supervisor de turno.
            </p>

            <div className="space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl font-black text-slate-600">+</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  value={telefonoTemp}
                  onChange={(e) => setTelefonoTemp(e.target.value)}
                  placeholder="56912345678"
                  className="w-full border-2 border-white/20 bg-transparent py-5 pl-10 pr-4 font-mono text-2xl font-black text-white focus:border-amber-500 focus:outline-none rounded-sm"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={guardarTelefono}
                  className="w-full bg-white py-5 text-[14px] font-black uppercase tracking-[0.3em] text-black active:bg-slate-300 rounded-sm"
                >
                  GUARDAR ENLACE
                </button>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="w-full border-2 border-white/10 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 active:bg-white/5 rounded-sm"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}