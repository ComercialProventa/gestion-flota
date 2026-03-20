"use client";

import { useState, useEffect, useCallback } from "react";
import {
  obtenerNeumaticosBus,
  obtenerUltimoKmBus,
  registrarMovimientoNeumatico,
  type Neumatico,
} from "./actions";

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

const TODAS_LAS_POSICIONES = [...POSICIONES_DELANTERAS, ...POSICIONES_TRASERAS];

/** Etiquetas legibles para cada posición */
const LABEL_POSICION: Record<string, string> = {
  delantero_izquierdo: "Del. Izq.",
  delantero_derecho: "Del. Der.",
  trasero_exterior_izquierdo: "Tras. Ext. Izq.",
  trasero_interior_izquierdo: "Tras. Int. Izq.",
  trasero_interior_derecho: "Tras. Int. Der.",
  trasero_exterior_derecho: "Tras. Ext. Der.",
};

type Bus = { id: string; patente: string };

/**
 * ChasisInteractivo — Client Component principal.
 *
 * Representación visual de un bus visto desde arriba con 6 posiciones de neumáticos.
 * Permite:
 * - Seleccionar un bus del listado
 * - Ver los neumáticos instalados en cada posición
 * - Rotación: clic en un neumático (origen) → clic en otra posición (destino)
 * - Reciclaje: seleccionar un neumático → botón "Enviar a Reciclaje"
 * - Modal de confirmación pidiendo kilometraje actual
 */
export default function ChasisInteractivo({ buses }: { buses: Bus[] }) {
  // ─── Estado de selección de bus ──────────────────────────
  const [busId, setBusId] = useState("");
  const [neumaticos, setNeumaticos] = useState<Neumatico[]>([]);
  const [cargando, setCargando] = useState(false);

  // ─── Estado de interacción ───────────────────────────────
  const [seleccionado, setSeleccionado] = useState<{
    neumatico: Neumatico;
    posicion: string;
  } | null>(null);

  // ─── Estado del modal ────────────────────────────────────
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

  // ─── Cargar neumáticos al seleccionar un bus ─────────────
  const cargarNeumaticos = useCallback(async (id: string) => {
    setCargando(true);
    setSeleccionado(null);
    setFeedback(null);
    const data = await obtenerNeumaticosBus(id);
    setNeumaticos(data);
    setCargando(false);
  }, []);

  useEffect(() => {
    if (busId) cargarNeumaticos(busId);
    else setNeumaticos([]);
  }, [busId, cargarNeumaticos]);

  // ─── Helper: obtener neumático en una posición ───────────
  function getNeumaticoEnPosicion(posicion: string): Neumatico | null {
    return neumaticos.find((n) => n.posicion_actual === posicion) || null;
  }

  // ─── Lógica de clic en un slot ───────────────────────────
  function handleSlotClick(posicion: string) {
    const neumaticoEnSlot = getNeumaticoEnPosicion(posicion);

    // Si no hay nada seleccionado
    if (!seleccionado) {
      if (neumaticoEnSlot) {
        // Seleccionar este neumático como origen
        setSeleccionado({ neumatico: neumaticoEnSlot, posicion });
      }
      return;
    }

    // Si hace clic en el mismo slot que ya está seleccionado → deseleccionar
    if (seleccionado.posicion === posicion) {
      setSeleccionado(null);
      return;
    }

    // ─── Definir movimiento de rotación ─────────────────
    // Abrir modal para pedir kilometraje
    abrirModal("rotacion", seleccionado.neumatico, seleccionado.posicion, posicion, neumaticoEnSlot);
  }

  // ─── Abrir modal de reciclaje ────────────────────────────
  function handleReciclaje() {
    if (!seleccionado) return;
    abrirModal("reciclaje", seleccionado.neumatico, seleccionado.posicion, null, null);
  }

  // ─── Abrir el modal ──────────────────────────────────────
  async function abrirModal(
    accion: "rotacion" | "reciclaje",
    neumaticoOrigen: Neumatico,
    posOrigen: string,
    posDestino: string | null,
    neumaticoDestino: Neumatico | null
  ) {
    // Obtener último km para validación
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

  // ─── Confirmar acción desde el modal ─────────────────────
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
      // Recargar neumáticos
      await cargarNeumaticos(busId);
    }
  }

  // ─── Cerrar modal ────────────────────────────────────────
  function cerrarModal() {
    setModal({ ...modal, visible: false });
    setModalError(null);
  }

  // ──────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* ─── Selector de Bus ─── */}
      <div>
        <label htmlFor="bus-selector" className="block text-sm font-medium text-slate-300 mb-1.5">
          Selecciona un bus
        </label>
        <select
          id="bus-selector"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3.5 text-base text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
        >
          <option value="">Elige un bus...</option>
          {buses.map((b) => (
            <option key={b.id} value={b.id}>{b.patente}</option>
          ))}
        </select>
      </div>

      {/* ─── Feedback ─── */}
      {feedback && (
        <div className={`rounded-xl border p-4 flex items-center gap-3 text-sm font-medium ${
          feedback.tipo === "ok"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-red-500/30 bg-red-500/10 text-red-400"
        }`}>
          {feedback.tipo === "ok" ? "✅" : "❌"} {feedback.msg}
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
                  : "Haz clic en un neumático para seleccionarlo."}
              </p>

              {/* ═══ Chasis del bus ═══ */}
              <div className="relative mx-auto w-full max-w-xs">
                {/* Borde del bus */}
                <div className="rounded-3xl border-2 border-slate-600/60 bg-slate-800/40 p-4 space-y-3">
                  {/* Frente del bus (indicador) */}
                  <div className="flex justify-center mb-1">
                    <span className="px-3 py-1 rounded-full bg-slate-700/60 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                      Frente
                    </span>
                  </div>

                  {/* ─── Eje Delantero (2 posiciones) ─── */}
                  <div className="flex justify-between gap-3">
                    {POSICIONES_DELANTERAS.map((pos) => (
                      <SlotNeumatico
                        key={pos}
                        posicion={pos}
                        neumatico={getNeumaticoEnPosicion(pos)}
                        seleccionado={seleccionado?.posicion === pos}
                        esDestinoValido={seleccionado !== null && seleccionado.posicion !== pos}
                        onClick={() => handleSlotClick(pos)}
                      />
                    ))}
                  </div>

                  {/* Cuerpo visual del bus */}
                  <div className="h-16 rounded-xl border border-dashed border-slate-700/40 flex items-center justify-center">
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">Chasis</span>
                  </div>

                  {/* ─── Eje Trasero (4 posiciones) ─── */}
                  <div className="flex justify-between gap-2">
                    {POSICIONES_TRASERAS.map((pos) => (
                      <SlotNeumatico
                        key={pos}
                        posicion={pos}
                        neumatico={getNeumaticoEnPosicion(pos)}
                        seleccionado={seleccionado?.posicion === pos}
                        esDestinoValido={seleccionado !== null && seleccionado.posicion !== pos}
                        onClick={() => handleSlotClick(pos)}
                      />
                    ))}
                  </div>

                  {/* Parte trasera del bus */}
                  <div className="flex justify-center mt-1">
                    <span className="px-3 py-1 rounded-full bg-slate-700/60 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                      Trasera
                    </span>
                  </div>
                </div>
              </div>

              {/* ─── Botón flotante de reciclaje ─── */}
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

              {/* ─── Leyenda ─── */}
              <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-amber-500/30 border border-amber-500/50" /> Instalado
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-slate-700 border border-slate-600" /> Vacío
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-sky-500/30 border-2 border-sky-400" /> Seleccionado
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          MODAL DE CONFIRMACIÓN
          ═══════════════════════════════════════════════════════ */}
      {modal.visible && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800 p-6 shadow-2xl space-y-4 animate-in">
            {/* Título */}
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

            {/* Detalle del movimiento */}
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

            {/* Input de kilometraje */}
            <div>
              <label htmlFor="km-modal" className="block text-sm font-medium text-slate-300 mb-1.5">
                Kilometraje actual del bus
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

            {/* Error */}
            {modalError && (
              <p className="text-sm text-red-400 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {modalError}
              </p>
            )}

            {/* Botones */}
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
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: SlotNeumatico (tarjeta individual)
// ═══════════════════════════════════════════════════════════════

/**
 * Representa una posición en el chasis del bus.
 *
 * - Si tiene un neumático instalado: muestra código + desgaste + fondo amber
 * - Si está vacío: muestra "Vacío" con fondo gris
 * - Si está seleccionado: borde sky brillante
 * - Si es un destino válido (hay algo seleccionado): borde punteado
 */
function SlotNeumatico({
  posicion,
  neumatico,
  seleccionado,
  esDestinoValido,
  onClick,
}: {
  posicion: string;
  neumatico: Neumatico | null;
  seleccionado: boolean;
  esDestinoValido: boolean;
  onClick: () => void;
}) {
  const ocupado = neumatico !== null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 min-w-0 rounded-xl p-2.5 text-center transition-all duration-200 cursor-pointer
        ${seleccionado
          ? "border-2 border-sky-400 bg-sky-500/15 ring-2 ring-sky-400/30 scale-105"
          : esDestinoValido
            ? "border-2 border-dashed border-amber-500/40 bg-slate-800/60 hover:border-amber-400 hover:bg-amber-500/10"
            : ocupado
              ? "border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20"
              : "border border-slate-700 bg-slate-800/60 hover:bg-slate-700/60"
        }
      `}
    >
      {/* Etiqueta de posición */}
      <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-1 truncate">
        {LABEL_POSICION[posicion]}
      </p>

      {ocupado ? (
        <>
          {/* Ícono de rueda */}
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
  );
}
