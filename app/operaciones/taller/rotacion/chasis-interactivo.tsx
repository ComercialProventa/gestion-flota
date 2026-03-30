"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  obtenerNeumaticosBus,
  obtenerUltimoKmBus,
  registrarMovimientoNeumatico,
  obtenerNeumaticosInventario,
  obtenerModelosNeumaticos,
  type Neumatico,
  type NeumaticoInventario,
  type ModeloNeumatico,
} from "./actions";
import { getBusesParaRotacion } from "../../actions";
import ModalReemplazo from "./modal-reemplazo";

// ─── Constantes de posiciones ─────────────────────
const POSICIONES_DELANTERAS = ["delantero_izquierdo", "delantero_derecho"] as const;
const POSICIONES_TRASERAS = [
  "trasero_exterior_izquierdo", "trasero_interior_izquierdo",
  "trasero_interior_derecho", "trasero_exterior_derecho",
] as const;
const POSICIONES_TRASERAS_M2 = [
  "trasero2_exterior_izquierdo", "trasero2_interior_izquierdo",
  "trasero2_interior_derecho", "trasero2_exterior_derecho",
] as const;

// Etiquetas ultra cortas para que siempre quepan
const LABEL_POSICION: Record<string, string> = {
  delantero_izquierdo: "IZQ",
  delantero_derecho: "DER",
  trasero_exterior_izquierdo: "EXT. IZQ",
  trasero_interior_izquierdo: "INT. IZQ",
  trasero_interior_derecho: "INT. DER",
  trasero_exterior_derecho: "EXT. DER",
  trasero2_exterior_izquierdo: "EXT. IZQ",
  trasero2_interior_izquierdo: "INT. IZQ",
  trasero2_interior_derecho: "INT. DER",
  trasero2_exterior_derecho: "EXT. DER",
};

// Etiquetas completas para los modales
const LABEL_POSICION_FULL: Record<string, string> = {
  delantero_izquierdo: "DIRECCIÓN IZQUIERDA",
  delantero_derecho: "DIRECCIÓN DERECHA",
  trasero_exterior_izquierdo: "TRACCIÓN EXT. IZQ",
  trasero_interior_izquierdo: "TRACCIÓN INT. IZQ",
  trasero_interior_derecho: "TRACCIÓN INT. DER",
  trasero_exterior_derecho: "TRACCIÓN EXT. DER",
  trasero2_exterior_izquierdo: "EJE 3 EXT. IZQ",
  trasero2_interior_izquierdo: "EJE 3 INT. IZQ",
  trasero2_interior_derecho: "EJE 3 INT. DER",
  trasero2_exterior_derecho: "EJE 3 EXT. DER",
};

type Bus = {
  id: string;
  patente: string;
  foto_url?: string | null;
  chasis?: string;
  neumaticos?: { posicion_actual: string }[];
};

export default function ChasisInteractivo() {
  const { data: busesData, isLoading } = useQuery<Bus[]>({
    queryKey: ["buses_rotacion"],
    queryFn: getBusesParaRotacion,
    staleTime: 1000 * 60 * 5,
  });

  const buses = busesData || [];
  const [busId, setBusId] = useState("");
  const [neumaticos, setNeumaticos] = useState<Neumatico[]>([]);
  const [cargando, setCargando] = useState(false);

  const [seleccionado, setSeleccionado] = useState<{ neumatico: Neumatico; posicion: string; } | null>(null);

  const [modal, setModal] = useState<{
    visible: boolean; accion: "rotacion" | "reciclaje";
    neumaticoOrigen: Neumatico | null; posicionOrigen: string;
    posicionDestino: string | null; neumaticoDestino: Neumatico | null;
  }>({ visible: false, accion: "rotacion", neumaticoOrigen: null, posicionOrigen: "", posicionDestino: null, neumaticoDestino: null });

  const [kmInput, setKmInput] = useState("");
  const [ultimoKm, setUltimoKm] = useState(0);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tipo: "ok" | "error"; msg: string } | null>(null);

  const [inventario, setInventario] = useState<NeumaticoInventario[]>([]);
  const [modelos, setModelos] = useState<ModeloNeumatico[]>([]);
  const [modalUnificado, setModalUnificado] = useState<{ visible: boolean; posicion: string; neumaticoViejo: Neumatico | null; }>({ visible: false, posicion: "", neumaticoViejo: null });

  const [modalBusesVisible, setModalBusesVisible] = useState(true);

  const cargarNeumaticos = useCallback(async (id: string) => {
    setCargando(true); setSeleccionado(null); setFeedback(null);
    const [dataBus, dataInv, dataMod] = await Promise.all([
      obtenerNeumaticosBus(id), obtenerNeumaticosInventario(), obtenerModelosNeumaticos(),
    ]);
    setNeumaticos(dataBus); setInventario(dataInv); setModelos(dataMod);
    setCargando(false);
  }, []);

  useEffect(() => {
    if (busId) cargarNeumaticos(busId);
    else { setNeumaticos([]); setInventario([]); setModelos([]); }
  }, [busId, cargarNeumaticos]);

  function getNeumaticoEnPosicion(posicion: string): Neumatico | null {
    return neumaticos.find((n) => n.posicion_actual === posicion) || null;
  }

  function handleSlotClick(posicion: string) {
    const neumaticoEnSlot = getNeumaticoEnPosicion(posicion);
    if (!seleccionado) {
      if (neumaticoEnSlot) setSeleccionado({ neumatico: neumaticoEnSlot, posicion });
      else abrirModalUnificado(posicion, null);
      return;
    }
    if (seleccionado.posicion === posicion) {
      setSeleccionado(null); return;
    }
    abrirModal("rotacion", seleccionado.neumatico, seleccionado.posicion, posicion, neumaticoEnSlot);
  }

  function handleReemplazarRapido(posicion: string, neumatico: Neumatico) {
    setSeleccionado(null);
    abrirModalUnificado(posicion, neumatico);
  }

  async function abrirModalUnificado(posicion: string, neumaticoViejo: Neumatico | null) {
    const km = await obtenerUltimoKmBus(busId);
    setUltimoKm(km);
    setModalUnificado({ visible: true, posicion, neumaticoViejo });
  }

  function handleReciclaje() {
    if (!seleccionado) return;
    abrirModal("reciclaje", seleccionado.neumatico, seleccionado.posicion, null, null);
  }

  async function abrirModal(accion: "rotacion" | "reciclaje", neumaticoOrigen: Neumatico, posOrigen: string, posDestino: string | null, neumaticoDestino: Neumatico | null) {
    const km = await obtenerUltimoKmBus(busId);
    setUltimoKm(km); setKmInput(""); setModalError(null);
    setModal({ visible: true, accion, neumaticoOrigen, posicionOrigen: posOrigen, posicionDestino: posDestino, neumaticoDestino });
  }

  async function confirmarAccion() {
    const km = parseInt(kmInput, 10);
    if (isNaN(km) || km <= 0) { setModalError("KILOMETRAJE INVÁLIDO"); return; }
    if (km < ultimoKm) { setModalError(`DEBE SER MAYOR A ${ultimoKm.toLocaleString("es-CL")} KM`); return; }

    setModalLoading(true); setModalError(null);
    const result = await registrarMovimientoNeumatico({
      busId, neumaticoId: modal.neumaticoOrigen!.id, accion: modal.accion,
      posicionOrigen: modal.posicionOrigen, posicionDestino: modal.posicionDestino,
      kilometrajeMomento: km, neumaticoDestinoId: modal.neumaticoDestino?.id || null,
    });
    setModalLoading(false);

    if (result.error) setModalError(result.error);
    else {
      setModal({ ...modal, visible: false }); setSeleccionado(null);
      setFeedback({ tipo: "ok", msg: result.mensaje! });
      await cargarNeumaticos(busId);
    }
  }

  function cerrarModal() {
    setModal({ ...modal, visible: false });
    setModalError(null);
  }

  const busSeleccionado = buses.find((b) => b.id === busId);
  const is3Ejes = busSeleccionado?.chasis === "3_ejes_10_ruedas" || busSeleccionado?.chasis === "doble_piso_10";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-4"></div>
        <p className="text-sm font-bold animate-pulse uppercase tracking-widest">Cargando unidades...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full space-y-3 pb-8 antialiased">

      {/* ─── BOTÓN DE SELECCIÓN DE BUS (COMPACTADO) ─── */}
      {!busSeleccionado ? (
        <button
          onClick={() => setModalBusesVisible(true)}
          className="w-full flex items-center justify-center h-20 border-4 border-dashed border-amber-500/50 bg-amber-500/10 active:bg-amber-500/20 rounded-sm transition-all"
        >
          <span className="block text-2xl font-black uppercase text-amber-500 tracking-tighter">SELECCIONAR UNIDAD</span>
        </button>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col justify-center px-4 border-4 border-white/20 bg-black rounded-sm h-20">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1 leading-none">Unidad Activa</span>
            <span className="font-mono text-3xl font-black text-white tracking-tighter leading-none">{busSeleccionado.patente}</span>
          </div>
          <button
            onClick={() => setModalBusesVisible(true)}
            className="w-20 border-4 border-white/20 bg-[#121214] rounded-sm active:bg-white/5 transition-colors flex items-center justify-center text-white/50"
          >
            <span className="text-2xl font-black">X</span>
          </button>
        </div>
      )}

      {/* ─── FEEDBACK VISUAL ─── */}
      {feedback && (
        <div className={`p-4 border-4 text-[14px] font-black uppercase tracking-widest text-center rounded-sm ${feedback.tipo === "ok" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-red-500 bg-red-500/10 text-red-400"}`}>
          {feedback.msg}
        </div>
      )}

      {/* ─── CHASIS INDUSTRIAL ─── */}
      {busId && (
        <div className="flex flex-col w-full bg-black border-4 border-white/10 p-2 sm:p-4 rounded-sm">
          {cargando ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <span className="text-amber-500 text-2xl font-black uppercase tracking-widest animate-pulse">CARGANDO...</span>
            </div>
          ) : (
            <div className="flex flex-col w-full space-y-4">

              {/* Panel de Instrucción Dinámica */}
              <div className={`p-3 border-2 rounded-sm text-center ${seleccionado ? 'border-sky-500 bg-sky-500/20' : 'border-white/10 bg-white/5'}`}>
                <p className={`text-[14px] font-black uppercase tracking-widest leading-none ${seleccionado ? 'text-sky-400' : 'text-slate-400'}`}>
                  {seleccionado ? "DESTINO: TOCA OTRO ESPACIO O RECICLA" : "ORIGEN: TOCA UN NEUMÁTICO"}
                </p>
              </div>

              {/* ─── ESQUEMA DEL BUS ─── */}
              <div className="flex flex-col w-full space-y-4 pt-1">

                {/* EJE 1: DELANTERO */}
                <div className="flex justify-between gap-4 px-4 sm:px-12 w-full">
                  <div className="w-1/2">
                    <SlotNeumatico posicion="delantero_izquierdo" neumatico={getNeumaticoEnPosicion("delantero_izquierdo")} seleccionado={seleccionado?.posicion === "delantero_izquierdo"} esDestinoValido={seleccionado !== null && seleccionado.posicion !== "delantero_izquierdo"} onClick={() => handleSlotClick("delantero_izquierdo")} onReemplazar={(n: Neumatico) => handleReemplazarRapido("delantero_izquierdo", n)} />
                  </div>
                  <div className="w-1/2">
                    <SlotNeumatico posicion="delantero_derecho" neumatico={getNeumaticoEnPosicion("delantero_derecho")} seleccionado={seleccionado?.posicion === "delantero_derecho"} esDestinoValido={seleccionado !== null && seleccionado.posicion !== "delantero_derecho"} onClick={() => handleSlotClick("delantero_derecho")} onReemplazar={(n: Neumatico) => handleReemplazarRapido("delantero_derecho", n)} />
                  </div>
                </div>

                {/* SEPARADOR 1 */}
                <div className="h-2 bg-white/10 mx-10 rounded-sm" />

                {/* EJE 2: TRASERO */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2 w-full">
                  {POSICIONES_TRASERAS.map((pos) => (
                    <SlotNeumatico key={pos} posicion={pos} neumatico={getNeumaticoEnPosicion(pos)} seleccionado={seleccionado?.posicion === pos} esDestinoValido={seleccionado !== null && seleccionado.posicion !== pos} onClick={() => handleSlotClick(pos)} onReemplazar={(n: Neumatico) => handleReemplazarRapido(pos, n)} />
                  ))}
                </div>

                {/* SEPARADOR 2 Y EJE 3 (Si es 3 ejes) */}
                {is3Ejes && (
                  <>
                    <div className="h-2 bg-white/10 mx-10 rounded-sm" />
                    <div className="grid grid-cols-4 gap-1 sm:gap-2 w-full">
                      {POSICIONES_TRASERAS_M2.map((pos) => (
                        <SlotNeumatico key={pos} posicion={pos} neumatico={getNeumaticoEnPosicion(pos)} seleccionado={seleccionado?.posicion === pos} esDestinoValido={seleccionado !== null && seleccionado.posicion !== pos} onClick={() => handleSlotClick(pos)} onReemplazar={(n: Neumatico) => handleReemplazarRapido(pos, n)} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Botón de Reciclaje */}
              {seleccionado && (
                <button
                  onClick={handleReciclaje}
                  className="w-full h-20 mt-4 bg-red-600 border-4 border-red-500 text-white text-[18px] font-black uppercase tracking-[0.2em] rounded-sm active:bg-red-700 flex items-center justify-center gap-4 transition-all"
                >
                  DAR DE BAJA (RECICLAR)
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── MODAL DE CONFIRMACIÓN ─── */}
      {modal.visible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0a0a0a] border-4 border-white/20 p-6 rounded-sm space-y-6">
            <h3 className={`text-4xl font-black uppercase tracking-tighter leading-none ${modal.accion === 'reciclaje' ? 'text-red-500' : 'text-amber-500'}`}>
              {modal.accion === "reciclaje" ? "CONFIRMAR BAJA" : "CONFIRMAR ROTACIÓN"}
            </h3>

            <div className="bg-white/5 border-2 border-white/10 p-4 rounded-sm space-y-4">
              <div className="flex flex-col border-b-2 border-white/10 pb-4">
                <span className="text-[14px] font-black text-slate-500 uppercase tracking-widest">Código Neumático</span>
                <span className="font-mono text-4xl font-black text-white mt-1 leading-none">{modal.neumaticoOrigen?.codigo_unico}</span>
              </div>
              <div className="flex flex-col pt-2">
                <span className="text-[14px] font-black text-slate-500 uppercase tracking-widest">Movimiento Técnico</span>
                <span className="text-[16px] font-black text-amber-500 uppercase mt-2 leading-tight">
                  {LABEL_POSICION_FULL[modal.posicionOrigen]} <br />
                  <span className="text-white">{'>>'}</span> {modal.posicionDestino ? LABEL_POSICION_FULL[modal.posicionDestino] : 'RECICLAJE'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[16px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
                KM de la Unidad *
              </label>

              {/* ⚠️ INPUT DEL ODÓMETRO HIPER-GIGANTE ⚠️ */}
              <input
                type="tel"
                inputMode="numeric"
                value={kmInput}
                onChange={(e) => setKmInput(e.target.value.replace(/\D/g, ''))}
                placeholder={`${ultimoKm}`}
                className={`w-full h-28 border-4 bg-black px-2 font-mono text-[60px] sm:text-[80px] leading-none font-black text-white text-center focus:outline-none rounded-sm ${modalError ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-white/20 focus:border-amber-500'}`}
              />
              {modalError && <p className="text-[14px] font-black text-red-500 uppercase mt-3 text-center">⚠ {modalError}</p>}
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <button onClick={confirmarAccion} disabled={modalLoading || !kmInput} className={`w-full h-24 text-[20px] font-black uppercase tracking-[0.3em] rounded-sm disabled:opacity-30 ${modal.accion === 'reciclaje' ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'}`}>
                {modalLoading ? "GUARDANDO..." : "CONFIRMAR"}
              </button>
              <button onClick={cerrarModal} className="w-full h-16 border-4 border-white/10 text-[16px] font-black text-slate-500 uppercase tracking-widest rounded-sm active:bg-white/5">
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL SELECTOR DE BUSES (Ajustado) ─── */}
      {modalBusesVisible && (
        <div className="fixed inset-0 z-[150] bg-[#050505] animate-in slide-in-from-bottom-4 flex flex-col duration-200">

          {/* Cabecera Fija Compactada */}
          <div className="p-4 sm:p-5 shrink-0 border-b-4 border-white/10 flex justify-between items-center bg-black">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter leading-none">
                SELECCIONAR UNIDAD
              </h3>
              <p className="text-[11px] text-amber-500 font-black uppercase tracking-widest mt-1.5">
                FLOTA ACTIVA EN TALLER
              </p>
            </div>
            {busSeleccionado && (
              <button
                onClick={() => setModalBusesVisible(false)}
                className="h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center border-4 border-white/20 bg-[#121214] text-white font-black rounded-sm text-2xl active:bg-white/10 transition-colors"
              >
                X
              </button>
            )}
          </div>

          {/* Lista de Flota Densidad Táctica */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-20">
            {buses.map((b) => (
              <button
                key={b.id}
                onClick={() => { setBusId(b.id); setModalBusesVisible(false); }}
                className="w-full flex items-center justify-between border-4 border-white/10 bg-[#101010] p-4 sm:p-5 active:bg-amber-500 active:border-amber-500 transition-colors group rounded-sm"
              >
                <span className="font-mono text-4xl sm:text-5xl font-black tracking-tighter uppercase group-active:text-black leading-none">
                  {b.patente}
                </span>
                <span className="text-[11px] sm:text-[13px] font-black text-slate-500 group-active:text-black/70 uppercase tracking-widest">
                  SELECCIONAR
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODAL UNIFICADO DE REEMPLAZO ─── */}
      {modalUnificado.visible && (
        <ModalReemplazo busId={busId} posicion={modalUnificado.posicion} neumaticoViejo={modalUnificado.neumaticoViejo} inventario={inventario} modelos={modelos} ultimoKm={ultimoKm} onCerrar={() => setModalUnificado({ visible: false, posicion: "", neumaticoViejo: null })} onExito={async (msg) => { setModalUnificado({ visible: false, posicion: "", neumaticoViejo: null }); setSeleccionado(null); setFeedback({ tipo: "ok", msg }); await cargarNeumaticos(busId); }} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE SLOT: Estructurado y con icono real de reemplazo
// ═══════════════════════════════════════════════════════════════

function SlotNeumatico({ posicion, neumatico, seleccionado, esDestinoValido, onClick, onReemplazar }: any) {
  const ocupado = neumatico !== null;

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={onClick}
        // Usamos flex-col y justify-between para asegurar que los bloques internos midan lo mismo siempre
        className={`w-full flex flex-col justify-between p-2 sm:p-3 rounded-sm border-4 transition-all duration-100 min-h-[120px] sm:min-h-[140px] ${seleccionado
          ? "border-sky-500 bg-sky-500/30 text-sky-400 scale-[1.03] z-20 relative shadow-[0_0_25px_rgba(14,165,233,0.5)]"
          : esDestinoValido
            ? "border-amber-500 border-dashed bg-amber-500/10 animate-pulse"
            : ocupado
              ? "border-amber-500/60 bg-[#121214] active:bg-white/10"
              : "border-white/20 border-dashed bg-[#0a0a0a] active:bg-white/10"
          }`}
      >
        {/* BLOQUE SUPERIOR: Etiqueta Posición */}
        <div className="w-full flex items-start justify-center h-4">
          <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-tighter text-center leading-none ${seleccionado ? 'text-sky-400' : 'text-slate-500'}`}>
            {LABEL_POSICION[posicion]}
          </p>
        </div>

        {/* BLOQUE CENTRAL: Código o "INSTALAR" */}
        <div className="flex-1 w-full flex items-center justify-center">
          {ocupado ? (
            <p className="font-mono text-[14px] sm:text-[17px] font-black text-white leading-none break-all text-center">
              {neumatico.codigo_unico}
            </p>
          ) : (
            <p className="text-[13px] sm:text-[15px] font-black text-emerald-500 uppercase">
              INSTALAR
            </p>
          )}
        </div>

        {/* BLOQUE INFERIOR: Kilometraje o Vacío (Para mantener la altura simétrica) */}
        <div className="w-full flex items-end justify-center h-4">
          {ocupado ? (
            <p className="text-[10px] sm:text-[12px] font-black text-amber-500 leading-none">
              {(neumatico.desgaste_acumulado_km || 0).toLocaleString()} KM
            </p>
          ) : (
            <div className="h-full w-full" /> // Div invisible para forzar la misma alineación
          )}
        </div>
      </button>

      {/* ⚠️ BOTÓN DE REEMPLAZO CON ICONO REAL DE ROTACIÓN ⚠️ */}
      {ocupado && !seleccionado && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onReemplazar(neumatico); }}
          className="absolute -top-3 -right-3 z-30 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-sm bg-amber-500 border-4 border-black text-black shadow-lg active:scale-90 transition-transform"
        >
          {/* Icono Heroicons "arrow-path" (Reemplazo/Rotación) en lugar de una "X" */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
    </div>
  );
}