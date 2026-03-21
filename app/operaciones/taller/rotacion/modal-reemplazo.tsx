"use client";

import { useState } from "react";
import {
  ejecutarReemplazoNeumatico,
  type NeumaticoInventario,
  type ModeloNeumatico,
  type Neumatico,
} from "./actions";

const LABEL_POSICION: Record<string, string> = {
  delantero_izquierdo: "Del. Izq.",
  delantero_derecho: "Del. Der.",
  trasero_exterior_izquierdo: "Tras. Ext. Izq.",
  trasero_interior_izquierdo: "Tras. Int. Izq.",
  trasero_interior_derecho: "Tras. Int. Der.",
  trasero_exterior_derecho: "Tras. Ext. Der.",
};

type TabActivo = "inventario" | "compra_directa";

/**
 * ModalReemplazo — Modal unificado con tabs para instalar/reemplazar neumáticos.
 *
 * Tab 1: "Desde Inventario" → Select de neumáticos en bodega.
 * Tab 2: "Compra Directa"  → Select de Modelo + Factura + Proveedor.
 * Campo compartido final: Kilometraje actual de la Unidad.
 */
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
    if (isNaN(kmNum) || kmNum <= 0) {
      setError("Ingresa un kilometraje válido");
      return;
    }
    if (kmNum < ultimoKm) {
      setError(`El kilometraje no puede ser menor al último registrado (${ultimoKm.toLocaleString("es-CL")} km)`);
      return;
    }

    if (tab === "inventario" && !neumaticoInvId) {
      setError("Selecciona un neumático del inventario");
      return;
    }
    if (tab === "compra_directa" && !modeloId) {
      setError("Selecciona un modelo de neumático");
      return;
    }

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

    if (result.error) {
      setError(result.error);
    } else {
      onExito(result.mensaje!);
    }
  }

  const inputClasses = "w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${esReemplazo ? "bg-amber-600/20 text-amber-400" : "bg-emerald-600/20 text-emerald-400"}`}>
              {esReemplazo ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                {esReemplazo ? "Reemplazar Neumático" : "Instalar Neumático"}
              </h3>
              <p className="text-xs text-slate-400">
                Posición: <span className="text-white font-medium">{LABEL_POSICION[posicion]}</span>
              </p>
            </div>
            <button type="button" onClick={onCerrar} className="text-slate-500 hover:text-white transition-colors cursor-pointer p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Info del neumático viejo (si es reemplazo) */}
          {esReemplazo && (
            <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs">
              <span className="text-red-400 font-semibold">Sale:</span>
              <span className="text-slate-300 ml-1.5 font-mono">{neumaticoViejo!.codigo_unico}</span>
              <span className="text-slate-500 ml-1.5">({(neumaticoViejo!.desgaste_acumulado_km || 0).toLocaleString("es-CL")} km)</span>
              <span className="text-red-400/70 ml-1.5">→ reciclaje</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700/50">
          <button
            type="button"
            onClick={() => { setTab("inventario"); setError(null); }}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
              tab === "inventario"
                ? "text-sky-400 border-b-2 border-sky-400 bg-sky-500/5"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            📦 Desde Inventario
          </button>
          <button
            type="button"
            onClick={() => { setTab("compra_directa"); setError(null); }}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
              tab === "compra_directa"
                ? "text-sky-400 border-b-2 border-sky-400 bg-sky-500/5"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            🛒 Compra Directa
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {tab === "inventario" ? (
            /* ─── TAB 1: Desde Inventario ─── */
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Neumático disponible en bodega
              </label>
              <select
                value={neumaticoInvId}
                onChange={(e) => setNeumaticoInvId(e.target.value)}
                className={inputClasses}
              >
                <option value="">Selecciona un neumático...</option>
                {inventario.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.codigo_unico} — {n.modelo_marca} {n.modelo_medida}
                  </option>
                ))}
              </select>
              {inventario.length === 0 && (
                <p className="mt-1 text-xs text-amber-400">
                  No hay neumáticos en inventario. Usa la pestaña "Compra Directa".
                </p>
              )}
            </div>
          ) : (
            /* ─── TAB 2: Compra Directa ─── */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Modelo (Marca / Medida)
                </label>
                <select
                  value={modeloId}
                  onChange={(e) => setModeloId(e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Selecciona un modelo...</option>
                  {modelos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.marca} — {m.medida} (vida útil: {m.vida_util_km.toLocaleString("es-CL")} km)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    N° Factura
                  </label>
                  <input
                    type="text"
                    value={factura}
                    onChange={(e) => setFactura(e.target.value)}
                    placeholder="Ej: F-001234"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Proveedor
                  </label>
                  <input
                    type="text"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                    placeholder="Ej: Michelin Chile"
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Precio Unitario ($)
                </label>
                <input
                  type="number"
                  min={1}
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Ej: 250000"
                  className={inputClasses}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Número de Serie *
                  </label>
                  <input
                    type="text"
                    required
                    value={numeroSerie}
                    onChange={(e) => setNumeroSerie(e.target.value)}
                    placeholder="Grabado en la goma"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    DOT (Semana/Año) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={dot}
                    onChange={(e) => setDot(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej: 4223"
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Condición del Neumático
                </label>
                <select
                  value={cicloVida}
                  onChange={(e) => setCicloVida(e.target.value)}
                  className={inputClasses}
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="recapado_1">Recapado 1</option>
                  <option value="recapado_2">Recapado 2</option>
                  <option value="recapado_3">Recapado 3</option>
                </select>
              </div>
            </div>
          )}

          {/* ─── Campo compartido: Kilometraje ─── */}
          <div className="pt-2 border-t border-slate-700/30">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Kilometraje actual de la Unidad *
            </label>
            <input
              type="number"
              min={1}
              value={km}
              onChange={(e) => setKm(e.target.value)}
              placeholder={`Mín: ${ultimoKm.toLocaleString("es-CL")} km`}
              className={`${inputClasses} font-mono`}
            />
            {ultimoKm > 0 && (
              <p className="mt-1 text-[10px] text-slate-500">
                Último registro: {ultimoKm.toLocaleString("es-CL")} km
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">❌ {error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            type="button"
            onClick={onCerrar}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={loading || !km || (tab === "inventario" ? !neumaticoInvId : (!modeloId || !precio || !numeroSerie || dot.length !== 4))}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              esReemplazo
                ? "bg-amber-600 shadow-amber-600/25 hover:bg-amber-500"
                : "bg-emerald-600 shadow-emerald-600/25 hover:bg-emerald-500"
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Procesando...
              </span>
            ) : esReemplazo ? (
              "Reemplazar"
            ) : (
              "Instalar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
