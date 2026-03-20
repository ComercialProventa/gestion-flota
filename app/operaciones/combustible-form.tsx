"use client";

import { useState, useEffect } from "react";
import { obtenerUltimoKilometraje, registrarCargaCombustible } from "./actions";

/**
 * Tipo para los buses que recibe como props del Server Component.
 */
type Bus = {
  id: string;
  patente: string;
};

/**
 * Client Component — Formulario de carga de combustible (mobile-first).
 *
 * Usa "use client" porque necesita:
 * - Estado de React para manejar fecha/hora, último km, validación y loading
 * - Efectos para cargar el último km cuando se selecciona un bus
 * - Validación en tiempo real del "hard block" de kilometraje
 *
 * Props:
 * - buses: lista de buses (id, patente) obtenida desde el Server Component
 */
export default function CombustibleForm({ buses }: { buses: Bus[] }) {
  // Estados del formulario
  const [busId, setBusId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [litros, setLitros] = useState("");

  // Estados de validación y UX
  const [ultimoKm, setUltimoKm] = useState<number | null>(null);
  const [cargandoKm, setCargandoKm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  // Inicializar fecha y hora con la actual
  useEffect(() => {
    const ahora = new Date();
    // Formato YYYY-MM-DD para el input date
    const fechaLocal = ahora.toLocaleDateString("en-CA"); // en-CA da formato YYYY-MM-DD
    // Formato HH:MM para el input time
    const horaLocal = ahora.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    setFecha(fechaLocal);
    setHora(horaLocal);
  }, []);

  // Cuando se selecciona un bus, obtener su último kilometraje
  useEffect(() => {
    if (!busId) {
      setUltimoKm(null);
      return;
    }

    setCargandoKm(true);
    obtenerUltimoKilometraje(busId)
      .then((km) => {
        setUltimoKm(km);
        setCargandoKm(false);
      })
      .catch(() => {
        setUltimoKm(0);
        setCargandoKm(false);
      });
  }, [busId]);

  // ─── Validación "Hard Block" ─────────────────────────────────
  // Si el kilometraje actual es <= al último registrado, bloquear el envío
  const kmActual = parseInt(kilometraje, 10);
  const hardBlockActivo =
    ultimoKm !== null &&
    !isNaN(kmActual) &&
    kmActual > 0 &&
    kmActual <= ultimoKm;

  const formularioValido =
    busId !== "" &&
    fecha !== "" &&
    hora !== "" &&
    !isNaN(kmActual) &&
    kmActual > 0 &&
    !isNaN(parseFloat(litros)) &&
    parseFloat(litros) > 0 &&
    !hardBlockActivo;

  // ─── Envío del formulario ────────────────────────────────────
  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setExito(null);

    const result = await registrarCargaCombustible(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setExito(result.mensaje!);
      // Limpiar formulario
      setBusId("");
      setKilometraje("");
      setLitros("");
      setUltimoKm(null);
      // Resetear fecha/hora a la actual
      const ahora = new Date();
      setFecha(ahora.toLocaleDateString("en-CA"));
      setHora(
        ahora.toLocaleTimeString("es-CL", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* ─── Mensaje de éxito ─── */}
      {exito && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-emerald-400">{exito}</p>
        </div>
      )}

      {/* ─── Mensaje de error ─── */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-red-400">{error}</p>
        </div>
      )}

      {/* ─── Selector de Bus ─── */}
      <div>
        <label htmlFor="bus_id" className="block text-sm font-medium text-slate-300 mb-1.5">
          Bus
        </label>
        <select
          id="bus_id"
          name="bus_id"
          required
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3.5 text-base text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
        >
          <option value="">Selecciona un bus</option>
          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {bus.patente}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Fecha y Hora (lado a lado) ─── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-slate-300 mb-1.5">
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3.5 text-base text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="hora" className="block text-sm font-medium text-slate-300 mb-1.5">
            Hora
          </label>
          <input
            id="hora"
            name="hora"
            type="time"
            required
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3.5 text-base text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* ─── Último Kilometraje (solo lectura) ─── */}
      {busId && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Último Kilometraje Registrado
          </label>
          <div className="w-full rounded-xl border border-slate-600/50 bg-slate-800/50 px-4 py-3.5 text-base font-mono text-slate-300">
            {cargandoKm ? (
              <span className="inline-flex items-center gap-2 text-slate-500">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Cargando...
              </span>
            ) : (
              <span>
                {ultimoKm === 0 ? "Sin registros previos" : `${ultimoKm?.toLocaleString("es-CL")} km`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ─── Kilometraje Actual (con validación Hard Block) ─── */}
      <div>
        <label htmlFor="kilometraje" className="block text-sm font-medium text-slate-300 mb-1.5">
          Kilometraje Actual
        </label>
        <input
          id="kilometraje"
          name="kilometraje"
          type="number"
          required
          min={1}
          placeholder="Ej: 125400"
          value={kilometraje}
          onChange={(e) => setKilometraje(e.target.value)}
          className={`w-full rounded-xl border px-4 py-3.5 text-base font-mono text-white placeholder-slate-400 focus:outline-none transition-colors ${
            hardBlockActivo
              ? "border-red-500 bg-red-500/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-600 bg-slate-700/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          }`}
        />
        {/* Mensaje de error del Hard Block */}
        {hardBlockActivo && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            El kilometraje debe ser mayor al anterior ({ultimoKm?.toLocaleString("es-CL")} km)
          </p>
        )}
      </div>

      {/* ─── Litros Cargados ─── */}
      <div>
        <label htmlFor="litros_cargados" className="block text-sm font-medium text-slate-300 mb-1.5">
          Litros Cargados
        </label>
        <input
          id="litros_cargados"
          name="litros_cargados"
          type="number"
          required
          min={0.1}
          step={0.1}
          placeholder="Ej: 45.5"
          value={litros}
          onChange={(e) => setLitros(e.target.value)}
          className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3.5 text-base font-mono text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
        />
      </div>

      {/* ─── Botón de envío ─── */}
      <button
        type="submit"
        disabled={loading || !formularioValido}
        className="w-full rounded-xl bg-amber-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-amber-600/25 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Registrando...
          </span>
        ) : (
          "Registrar Carga"
        )}
      </button>
    </form>
  );
}
