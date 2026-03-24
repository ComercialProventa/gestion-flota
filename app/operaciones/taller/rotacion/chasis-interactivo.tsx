"use client";

import { useState, useEffect, useCallback } from "react";
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
import ModalReemplazo from "./modal-reemplazo";
import Image from "next/image";
import ChasisPreview from "@/components/buses/chasis-preview";

// ─── Constantes de posiciones del chasis ─────────────────────
const POSICIONES_DELANTERAS = [
  "delantero_izquierdo",
  "delantero_derecho",
] as const;

const POSICIONES_TRASERAS = [
  "trasero_exterior_izquierdo",
  "trasero_interior_izquierdo",
  "trasero_interior_derecho",
  "trasero_exterior_derecho",
] as const;

const POSICIONES_TRASERAS_M2 = [
  "trasero2_exterior_izquierdo",
  "trasero2_interior_izquierdo",
  "trasero2_interior_derecho",
  "trasero2_exterior_derecho",
] as const;

/** Etiquetas legibles para cada posición */
const LABEL_POSICION: Record<string, string> = {
  delantero_izquierdo: "Del. Izq.",
  delantero_derecho: "Del. Der.",
  trasero_exterior_izquierdo: "Tras. Ext. Izq.",
  trasero_interior_izquierdo: "Tras. Int. Izq.",
  trasero_interior_derecho: "Tras. Int. Der.",
  trasero_exterior_derecho: "Tras. Ext. Der.",
  trasero2_exterior_izquierdo: "T2 Ext. Izq.",
  trasero2_interior_izquierdo: "T2 Int. Izq.",
  trasero2_interior_derecho: "T2 Int. Der.",
  trasero2_exterior_derecho: "T2 Ext. Der.",
};

type Bus = {
  id: string;
  patente: string;
  foto_url?: string | null;
  chasis?: string;
  neumaticos?: { posicion_actual: string }[];
};

/**
 * ChasisInteractivo — Client Component principal.
 *
 * Representación visual de un bus visto desde arriba con 6 posiciones de neumáticos.
 * Permite:
 * - Seleccionar un bus del listado
 * - Ver los neumáticos instalados en cada posición
 * - Rotación: clic en un neumático (origen) → clic en otra posición (destino)
 * - Reciclaje: seleccionar un neumático → botón "Enviar a Reciclaje"
 * - Reemplazo en 1 clic: botón 🔄 → Modal unificado (Inventario / Compra Directa)
 * - Instalación en slot vacío: clic → Modal unificado
 */
export default function ChasisInteractivo({ buses }: { buses: Bus[] }) {
  // ─── Estado de selección de bus ──────────────────────────
  const [busId, setBusId] = useState("");
  const [neumaticos, setNeumaticos] = useState<Neumatico[]>([]);
  const [cargando, setCargando] = useState(false);

  // ─── Estado de interacción (rotación) ────────────────────
  const [seleccionado, setSeleccionado] = useState<{
    neumatico: Neumatico;
    posicion: string;
  } | null>(null);

  // ─── Estado del modal de rotación/reciclaje ──────────────
  const [modal, setModal] = useState<{
    visible: boolean;
    accion: "rotacion" | "reciclaje";
    neumaticoOrigen: Neumatico | null;
    posicionOrigen: string;
    posicionDestino: string | null;
    neumaticoDestino: Neumatico | null;
  }>({
    visible: false,
    accion: "rotacion",
    neumaticoOrigen: null,
    posicionOrigen: "",
    posicionDestino: null,
    neumaticoDestino: null,
  });

  const [kmInput, setKmInput] = useState("");
  const [ultimoKm, setUltimoKm] = useState(0);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tipo: "ok" | "error"; msg: string } | null>(null);

  // ─── Estado del modal UNIFICADO de Instalación/Reemplazo ──
  const [inventario, setInventario] = useState<NeumaticoInventario[]>([]);
  const [modelos, setModelos] = useState<ModeloNeumatico[]>([]);
  const [modalUnificado, setModalUnificado] = useState<{
    visible: boolean;
    posicion: string;
    neumaticoViejo: Neumatico | null;
  }>({ visible: false, posicion: "", neumaticoViejo: null });

  // ─── Modal de selección de Bus ───
  const [modalBusesVisible, setModalBusesVisible] = useState(true);

  // ─── Cargar datos al seleccionar un bus ───────────────────
  const cargarNeumaticos = useCallback(async (id: string) => {
    setCargando(true);
    setSeleccionado(null);
    setFeedback(null);
    const [dataBus, dataInv, dataMod] = await Promise.all([
      obtenerNeumaticosBus(id),
      obtenerNeumaticosInventario(),
      obtenerModelosNeumaticos(),
    ]);
    setNeumaticos(dataBus);
    setInventario(dataInv);
    setModelos(dataMod);
    setCargando(false);
  }, []);

  useEffect(() => {
    if (busId) cargarNeumaticos(busId);
    else {
      setNeumaticos([]);
      setInventario([]);
      setModelos([]);
    }
  }, [busId, cargarNeumaticos]);

  // ─── Helper: obtener neumático en una posición ───────────
  function getNeumaticoEnPosicion(posicion: string): Neumatico | null {
    return neumaticos.find((n) => n.posicion_actual === posicion) || null;
  }

  // ─── Lógica de clic en un slot ───────────────────────────
  function handleSlotClick(posicion: string) {
    const neumaticoEnSlot = getNeumaticoEnPosicion(posicion);

    if (!seleccionado) {
      if (neumaticoEnSlot) {
        setSeleccionado({ neumatico: neumaticoEnSlot, posicion });
      } else {
        // Slot vacío → Abrir modal unificado para INSTALACIÓN
        abrirModalUnificado(posicion, null);
      }
      return;
    }

    if (seleccionado.posicion === posicion) {
      setSeleccionado(null);
      return;
    }

    // Definir movimiento de rotación
    abrirModal("rotacion", seleccionado.neumatico, seleccionado.posicion, posicion, neumaticoEnSlot);
  }

  // ─── Reemplazo rápido: 🔄 overlay button ─────────────────
  function handleReemplazarRapido(posicion: string, neumatico: Neumatico) {
    setSeleccionado(null);
    abrirModalUnificado(posicion, neumatico);
  }

  // ─── Abrir modal unificado (instalación o reemplazo) ──────
  async function abrirModalUnificado(posicion: string, neumaticoViejo: Neumatico | null) {
    const km = await obtenerUltimoKmBus(busId);
    setUltimoKm(km);
    setModalUnificado({ visible: true, posicion, neumaticoViejo });
  }

  // ─── Reciclaje ────────────────────────────────────────────
  function handleReciclaje() {
    if (!seleccionado) return;
    abrirModal("reciclaje", seleccionado.neumatico, seleccionado.posicion, null, null);
  }

  // ─── Abrir modal de rotación/reciclaje ────────────────────
  async function abrirModal(
    accion: "rotacion" | "reciclaje",
    neumaticoOrigen: Neumatico,
    posOrigen: string,
    posDestino: string | null,
    neumaticoDestino: Neumatico | null
  ) {
    const km = await obtenerUltimoKmBus(busId);
    setUltimoKm(km);
    setKmInput("");
    setModalError(null);
    setModal({
      visible: true,
      accion,
      neumaticoOrigen,
      posicionOrigen: posOrigen,
      posicionDestino: posDestino,
      neumaticoDestino,
    });
  }

  // ─── Confirmar rotación/reciclaje ─────────────────────────
  async function confirmarAccion() {
    const km = parseInt(kmInput, 10);
    if (isNaN(km) || km <= 0) {
      setModalError("Ingresa un kilometraje válido");
      return;
    }
    if (km < ultimoKm) {
      setModalError(`El kilometraje no puede ser menor al último registrado (${ultimoKm.toLocaleString("es-CL")} km)`);
      return;
    }

    setModalLoading(true);
    setModalError(null);

    const result = await registrarMovimientoNeumatico({
      busId,
      neumaticoId: modal.neumaticoOrigen!.id,
      accion: modal.accion,
      posicionOrigen: modal.posicionOrigen,
      posicionDestino: modal.posicionDestino,
      kilometrajeMomento: km,
      neumaticoDestinoId: modal.neumaticoDestino?.id || null,
    });

    setModalLoading(false);

    if (result.error) {
      setModalError(result.error);
    } else {
      setModal({ ...modal, visible: false });
      setSeleccionado(null);
      setFeedback({ tipo: "ok", msg: result.mensaje! });
      await cargarNeumaticos(busId);
    }
  }

  function cerrarModal() {
    setModal({ ...modal, visible: false });
    setModalError(null);
  }

  // ──────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────

  const busSeleccionado = buses.find((b) => b.id === busId);
  const is3Ejes = busSeleccionado?.chasis === "3_ejes_10_ruedas" || busSeleccionado?.chasis === "doble_piso_10";

  return (
    <div className="space-y-4">
      {/* ─── Cabecera de Selección de Bus ─── */}
      {!busSeleccionado ? (
        <button
          type="button"
          onClick={() => setModalBusesVisible(true)}
          className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="h-12 w-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <span className="text-white font-medium text-[15px]">Seleccionar Vehículo</span>
          <span className="text-white/40 text-[12px] mt-1">Toca para elegir de la flota</span>
        </button>
      ) : (
        <div 
          onClick={() => setModalBusesVisible(true)}
          className="flex items-center gap-3 p-3 border border-white/10 bg-white/[0.04] rounded-2xl cursor-pointer hover:bg-white/[0.08] transition-colors"
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-black/40 border border-white/10 shrink-0">
            {busSeleccionado.foto_url ? (
               <Image src={busSeleccionado.foto_url} alt={busSeleccionado.patente} fill className="object-cover" />
            ) : (
               <div className="flex justify-center items-center w-full h-full text-xl">🚌</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-0.5">Vehículo Seleccionado</span>
            <span className="font-mono text-base font-bold text-white leading-tight">{busSeleccionado.patente}</span>
          </div>
          <div className="shrink-0 h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>
      )}

      {/* ─── Modal Selector de Vehículos ─── */}
      {modalBusesVisible && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
            <h3 className="text-lg font-semibold text-white">Seleccionar Vehículo</h3>
            {busSeleccionado && (
              <button
                type="button"
                onClick={() => setModalBusesVisible(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 text-white cursor-pointer hover:bg-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {buses.map((b) => {
              const is3EjesList = b.chasis === "3_ejes_10_ruedas" || b.chasis === "doble_piso_10";
              const missing = (is3EjesList 
                ? [
                    "delantero_izquierdo", "delantero_derecho",
                    "trasero_exterior_izquierdo", "trasero_interior_izquierdo",
                    "trasero_interior_derecho", "trasero_exterior_derecho",
                    "trasero2_exterior_izquierdo", "trasero2_interior_izquierdo",
                    "trasero2_interior_derecho", "trasero2_exterior_derecho"
                  ]
                : [
                    "delantero_izquierdo", "delantero_derecho",
                    "trasero_exterior_izquierdo", "trasero_interior_izquierdo",
                    "trasero_interior_derecho", "trasero_exterior_derecho"
                  ]
              ).filter(
                (p) => !b.neumaticos?.some((n) => n.posicion_actual === p)
              );

              const isSelected = busId === b.id;

              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setBusId(b.id);
                    setModalBusesVisible(false);
                  }}
                  className={`group relative flex cursor-pointer overflow-hidden rounded-xl border transition-all active:scale-[0.99] ${
                    isSelected 
                      ? "border-amber-500/50 bg-amber-500/[0.05]" 
                      : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.08]"
                  }`}
                >
                  {/* 1. Info */}
                  <div className="flex items-center gap-3 p-3 flex-1">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-black/40 border border-white/10 shrink-0">
                      {b.foto_url ? (
                        <Image 
                          src={b.foto_url} 
                          alt={b.patente} 
                          fill 
                          className="object-cover" 
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl">🚌</div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-base font-bold text-white tracking-wider">{b.patente}</span>
                      <span className="text-[11px] text-white/40 font-medium tracking-wider">
                        {isSelected ? "Seleccionado" : "Tocar para seleccionar"}
                      </span>
                    </div>
                  </div>

                  {/* 2. Mini Esquema Vertical */}
                  <div className="bg-black/20 px-4 border-l border-white/[0.06] flex items-center justify-center w-28 shrink-0 relative overflow-hidden">
                    <div className="scale-[0.5] origin-center absolute pointer-events-none">
                      <ChasisPreview 
                        tipo={(b.chasis as any) || "2_ejes_6_ruedas"} 
                        compact 
                        missingPositions={missing}
                        vertical={true}
                      />
                    </div>
                  </div>

                  {/* Badge */}
                  {missing.length > 0 && (
                    <div className="absolute top-2 left-2 rounded-full bg-red-500 text-[10px] font-bold text-white px-2 py-0.5 shadow-md border border-red-400">
                      {missing.length} Faltan
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Feedback ─── */}
      {feedback && (
        <div className={`rounded-lg border px-3 py-2.5 text-[13px] font-medium ${
          feedback.tipo === "ok"
            ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400"
            : "border-red-500/20 bg-red-500/[0.06] text-red-400"
        }`}>
          {feedback.tipo === "ok" ? "✓" : "✕"} {feedback.msg}
        </div>
      )}

      {/* ─── Chasis Visual ─── */}
      {busId && (
        <div className="space-y-4">
          {cargando ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Cargando neumáticos...
            </div>
          ) : (
            <>
              {/* Instrucción */}
              <p className="text-xs text-slate-500 text-center">
                {seleccionado
                  ? "Haz clic en otra posición para rotar, o usa el botón de reciclaje abajo."
                  : "Haz clic en un neumático para seleccionarlo. Usa 🔄 para reemplazo rápido."}
              </p>

              {/* ═══ Chasis del bus ═══ */}
              <div className="relative mx-auto w-full max-w-xs">
                <div className="rounded-3xl border-2 border-slate-600/60 bg-slate-800/40 p-4 space-y-3">
                  <div className="flex justify-center mb-1">
                    <span className="px-3 py-1 rounded-full bg-slate-700/60 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                      Frente
                    </span>
                  </div>

                  {/* Eje Delantero */}
                  <div className="flex justify-between gap-3">
                    {POSICIONES_DELANTERAS.map((pos) => (
                      <SlotNeumatico
                        key={pos}
                        posicion={pos}
                        neumatico={getNeumaticoEnPosicion(pos)}
                        seleccionado={seleccionado?.posicion === pos}
                        esDestinoValido={seleccionado !== null && seleccionado.posicion !== pos}
                        onClick={() => handleSlotClick(pos)}
                        onReemplazar={(n) => handleReemplazarRapido(pos, n)}
                      />
                    ))}
                  </div>

                  {/* Cuerpo visual del bus */}
                  <div className="h-16 rounded-xl border border-dashed border-slate-700/40 flex items-center justify-center">
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">Chasis</span>
                  </div>

                  {/* Eje Trasero M1 */}
                  <div className="flex justify-between gap-2">
                    {POSICIONES_TRASERAS.map((pos) => (
                      <SlotNeumatico
                        key={pos}
                        posicion={pos}
                        neumatico={getNeumaticoEnPosicion(pos)}
                        seleccionado={seleccionado?.posicion === pos}
                        esDestinoValido={seleccionado !== null && seleccionado.posicion !== pos}
                        onClick={() => handleSlotClick(pos)}
                        onReemplazar={(n) => handleReemplazarRapido(pos, n)}
                      />
                    ))}
                  </div>

                  {is3Ejes && (
                    <>
                      {/* Cuerpo visual intermedio M2 */}
                      <div className="h-6 rounded-xl border border-dashed border-slate-700/40 flex items-center justify-center">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider">M2</span>
                      </div>

                      {/* Eje Trasero M2 */}
                      <div className="flex justify-between gap-2">
                        {POSICIONES_TRASERAS_M2.map((pos) => (
                          <SlotNeumatico
                            key={pos}
                            posicion={pos}
                            neumatico={getNeumaticoEnPosicion(pos)}
                            seleccionado={seleccionado?.posicion === pos}
                            esDestinoValido={seleccionado !== null && seleccionado.posicion !== pos}
                            onClick={() => handleSlotClick(pos)}
                            onReemplazar={(n) => handleReemplazarRapido(pos, n)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <div className="flex justify-center mt-1">
                    <span className="px-3 py-1 rounded-full bg-slate-700/60 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                      Trasera
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón flotante de reciclaje */}
              {seleccionado && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleReciclaje}
                    className="flex items-center gap-2 rounded-xl bg-red-600/80 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Enviar a Reciclaje
                  </button>
                </div>
              )}

              {/* Leyenda */}
              <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-amber-500/30 border border-amber-500/50" /> Instalado
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500/30 border border-dashed border-emerald-500/50" /> Vacío
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-sky-500/30 border-2 border-sky-400" /> Seleccionado
                </span>
                <span className="flex items-center gap-1.5">
                  🔄 Reemplazo rápido
                </span>
              </div>

              {/* Indicador de inventario */}
              {inventario.length > 0 && (
                <p className="text-center text-xs text-emerald-400/70 pt-1">
                  📦 {inventario.length} neumático{inventario.length !== 1 ? "s" : ""} en inventario disponible{inventario.length !== 1 ? "s" : ""}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══ MODAL DE ROTACIÓN/RECICLAJE ═══ */}
      {modal.visible && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800 p-6 shadow-2xl space-y-4 animate-in">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                modal.accion === "reciclaje"
                  ? "bg-red-600/20 text-red-400"
                  : "bg-amber-600/20 text-amber-400"
              }`}>
                {modal.accion === "reciclaje" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {modal.accion === "reciclaje" ? "Confirmar Reciclaje" : "Confirmar Rotación"}
                </h3>
                <p className="text-xs text-slate-400">
                  Neumático: <span className="font-mono text-white">{modal.neumaticoOrigen?.codigo_unico}</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/50 p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Origen:</span>
                <span className="text-white font-medium">{LABEL_POSICION[modal.posicionOrigen]}</span>
              </div>
              {modal.accion === "rotacion" && modal.posicionDestino && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Destino:</span>
                  <span className="text-white font-medium">{LABEL_POSICION[modal.posicionDestino]}</span>
                </div>
              )}
              {modal.neumaticoDestino && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Intercambia con:</span>
                  <span className="font-mono text-amber-400">{modal.neumaticoDestino.codigo_unico}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="km-modal" className="block text-sm font-medium text-slate-300 mb-1.5">
                Kilometraje actual de la Unidad
              </label>
              <input
                id="km-modal"
                type="number"
                min={1}
                value={kmInput}
                onChange={(e) => setKmInput(e.target.value)}
                placeholder={`Mín: ${ultimoKm.toLocaleString("es-CL")} km`}
                className={`w-full rounded-xl border px-4 py-3.5 text-base font-mono text-white placeholder-slate-400 focus:outline-none transition-colors ${
                  modalError
                    ? "border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-600 bg-slate-700/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                }`}
              />
              {ultimoKm > 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  Último registro: {ultimoKm.toLocaleString("es-CL")} km
                </p>
              )}
            </div>

            {modalError && (
              <p className="text-sm text-red-400 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {modalError}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={cerrarModal}
                disabled={modalLoading}
                className="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarAccion}
                disabled={modalLoading || !kmInput}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                  modal.accion === "reciclaje"
                    ? "bg-red-600 shadow-red-600/25 hover:bg-red-500"
                    : "bg-amber-600 shadow-amber-600/25 hover:bg-amber-500"
                }`}
              >
                {modalLoading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Confirmar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL UNIFICADO DE INSTALACIÓN / REEMPLAZO ═══ */}
      {modalUnificado.visible && (
        <ModalReemplazo
          busId={busId}
          posicion={modalUnificado.posicion}
          neumaticoViejo={modalUnificado.neumaticoViejo}
          inventario={inventario}
          modelos={modelos}
          ultimoKm={ultimoKm}
          onCerrar={() => setModalUnificado({ visible: false, posicion: "", neumaticoViejo: null })}
          onExito={async (msg) => {
            setModalUnificado({ visible: false, posicion: "", neumaticoViejo: null });
            setSeleccionado(null);
            setFeedback({ tipo: "ok", msg });
            await cargarNeumaticos(busId);
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: SlotNeumatico (tarjeta individual con overlay 🔄)
// ═══════════════════════════════════════════════════════════════

function SlotNeumatico({
  posicion,
  neumatico,
  seleccionado,
  esDestinoValido,
  onClick,
  onReemplazar,
}: {
  posicion: string;
  neumatico: Neumatico | null;
  seleccionado: boolean;
  esDestinoValido: boolean;
  onClick: () => void;
  onReemplazar: (n: Neumatico) => void;
}) {
  const ocupado = neumatico !== null;

  return (
    <div className="relative flex-1 min-w-0 group/slot">
      <button
        type="button"
        onClick={onClick}
        className={`
          w-full rounded-xl p-2.5 text-center transition-all duration-200 cursor-pointer
          ${seleccionado
            ? "border-2 border-sky-400 bg-sky-500/15 ring-2 ring-sky-400/30 scale-105"
            : esDestinoValido
              ? "border-2 border-dashed border-amber-500/40 bg-slate-800/60 hover:border-amber-400 hover:bg-amber-500/10"
              : ocupado
                ? "border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20"
                : "border border-dashed border-emerald-600/30 bg-slate-800/60 hover:border-emerald-400 hover:bg-emerald-500/10"
          }
        `}
      >
        <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-1 truncate">
          {LABEL_POSICION[posicion]}
        </p>

        {ocupado ? (
          <>
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 border border-amber-500/30">
              <div className="h-5 w-5 rounded-full border-2 border-amber-400/60 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              </div>
            </div>
            <p className="font-mono text-[10px] font-bold text-white truncate">{neumatico.codigo_unico}</p>
            <p className="text-[9px] text-slate-400">
              {(neumatico.desgaste_acumulado_km || 0).toLocaleString("es-CL")} km
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
              <div className="h-5 w-5 rounded-full border-2 border-dashed border-slate-600" />
            </div>
            <p className="text-[10px] text-slate-600">Vacío</p>
          </>
        )}
      </button>

      {/* ─── Overlay: Botón 🔄 Reemplazar (solo si ocupado y no seleccionado) ─── */}
      {ocupado && !seleccionado && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReemplazar(neumatico);
          }}
          className="absolute -top-1.5 -right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white text-xs shadow-lg shadow-amber-600/30 opacity-0 group-hover/slot:opacity-100 transition-all duration-200 hover:bg-amber-500 hover:scale-110 cursor-pointer"
          title="Reemplazar neumático"
        >
          🔄
        </button>
      )}
    </div>
  );
}
