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
    // Cargar teléfono desde localStorage al montar
    const guardado = localStorage.getItem("proventa_supervisor_ws");
    if (guardado) {
      setTelefonoSupervisor(guardado);
    }
  }, []);

  function guardarTelefono() {
    let limpio = telefonoTemp.replace(/\D/g, "");
    if (!limpio.startsWith("569") && limpio.length === 8) {
       limpio = "569" + limpio;
    } else if (limpio.startsWith("9") && limpio.length === 9) {
       limpio = "56" + limpio;
    }
    localStorage.setItem("proventa_supervisor_ws", limpio);
    setTelefonoSupervisor(limpio);
    setModalAbierto(false);
  }

  function formatearFecha(isoStr: string) {
    if (!isoStr) return "";
    const [y, m, d] = isoStr.split("-");
    return `${d}/${m}/${y}`;
  }

  function formatearHora(horaStr: string) {
    if (!horaStr) return "";
    return horaStr.substring(0, 5);
  }

  function generarLinkWhatsApp(carga: HistorialCarga) {
    const fn = formatearFecha(carga.fecha);
    const hm = formatearHora(carga.hora);
    const patente = carga.buses?.patente || "Desconocido";
    const texto = `Hola, cometí un error en la carga de combustible del bus *${patente}*.\nFecha: ${fn} ${hm}\nLitros registrados: ${carga.litros_cargados} L\nKilometraje: ${carga.kilometraje} km.\nPor favor corregir en el sistema.`;
    const num = telefonoSupervisor || "";
    return `https://wa.me/${num}?text=${encodeURIComponent(texto)}`;
  }

  return (
    <div className="space-y-4">
      {/* Botón de Configuración WhatsApp */}
      <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
        <div>
          <h3 className="text-[14px] font-semibold text-white">Contacto Supervisor</h3>
          <p className="text-[11px] text-white/50 mt-0.5">
            {telefonoSupervisor 
              ? `Vía WhatsApp: +${telefonoSupervisor}` 
              : "No configurado (Requerido para reportes)"}
          </p>
        </div>
        <button
          onClick={() => {
            setTelefonoTemp(telefonoSupervisor);
            setModalAbierto(true);
          }}
          className="flex h-9 items-center justify-center rounded bg-white/10 px-3 text-[12px] font-semibold text-white hover:bg-white/20 transition-colors"
        >
          {telefonoSupervisor ? "Editar" : "Configurar"}
        </button>
      </div>

      {/* Lista de Historial */}
      {historial.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <p className="text-white/40 text-[13px]">No hay cargas en los últimos 2 días.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {historial.map((carga) => (
            <div key={carga.id} className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] p-3 transition-colors">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[14px] font-bold text-white tracking-wider">
                    {carga.buses?.patente || "---"}
                  </span>
                  <span className="text-[10px] text-white/40">
                    {formatearFecha(carga.fecha).slice(0, 5)} {formatearHora(carga.hora)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[12px] font-mono text-white/70">
                  <span>{carga.litros_cargados} L</span>
                  <span className="text-white/20">•</span>
                  <span>{carga.kilometraje.toLocaleString("es-CL")} km</span>
                </div>
              </div>

              {/* Botón Reportar Error Compacto */}
              <div>
                {telefonoSupervisor ? (
                  <a
                    href={generarLinkWhatsApp(carga)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                    title="Reportar Error"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                      <path d="M12.031 21.033A8.956 8.956 0 014.28 17.22l-1.077 3.93 4.026-1.055a8.96 8.96 0 114.802 1.353v-.415zm0-16.14a7.18 7.18 0 100 14.36 7.18 7.18 0 000-14.36z" />
                      <path d="M15.42 14.07c-.18-.09-1.07-.53-1.23-.59-.16-.06-.28-.09-.4.09s-.46.59-.57.71c-.11.12-.22.13-.4.04-.18-.09-.77-.28-1.46-.9-1.12-.99-1.27-1.11-1.45-1.11-.18 0-.3.1-.38.16l-.28.32c-.1.11-.26.13-.4.04-.14-.09-.64-.24-1.22-.76-.45-.4-.76-.9-.85-1.06-.09-.16-.01-.25.08-.34.08-.08.18-.21.27-.32a1.32 1.32 0 00.18-.3c.06-.12.03-.22-.01-.32s-.4-1.01-.55-1.38c-.15-.36-.3-.31-.4-.32h-.34c-.12 0-.32.04-.49.22a1.47 1.47 0 00-.46 1.09c0 .64.66 1.25.75 1.38.09.13.94 1.48 2.27 2.05.32.14.57.22.76.28.32.1.61.09.84.05.26-.04.79-.32.9-.63.11-.31.11-.58.08-.63-.03-.04-.12-.06-.3-.15z" />
                    </svg>
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      setTelefonoTemp("");
                      setModalAbierto(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                    title="Configurar para Reportar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-white/50">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Configuración WhatsApp */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-white/[0.06] bg-[#121214] p-5">
            <h3 className="text-[16px] font-bold text-white mb-2">WhatsApp Supervisor</h3>
            <p className="text-[12px] text-white/50 mb-4 leading-relaxed">
              Ingresa el número de tu supervisor para enviarle mensajes rápidos en caso de registrar mal una carga.
            </p>
            <input
              type="tel"
              value={telefonoTemp}
              onChange={(e) => setTelefonoTemp(e.target.value)}
              placeholder="Ej: 56912345678"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-[14px] text-white placeholder-white/20 focus:border-emerald-500/50 focus:outline-none mb-4 font-mono"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setModalAbierto(false)}
                className="flex-1 rounded-lg bg-white/5 py-2.5 text-[13px] font-semibold text-white/70 hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardarTelefono}
                className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-[13px] font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
