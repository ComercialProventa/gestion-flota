"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMovimientosNeumaticos, actualizarMovimientoNeumatico } from "./actions";

type MovimientoNeumatico = {
  id: string;
  accion: string;
  posicion_origen: string | null;
  posicion_destino: string | null;
  kilometraje_bus_momento: number;
  fecha_hora: string;
  buses?: { patente: string } | null;
  usuarios?: { nombre_completo: string } | null;
  neumaticos?: { codigo_unico: string } | null;
};

export default function RegistrosNeumaticosCliente() {
  const queryClient = useQueryClient();
  const { data: registros, isLoading } = useQuery<MovimientoNeumatico[]>({
    queryKey: ["movimientos_neumaticos"],
    queryFn: async () => {
      const data = await getMovimientosNeumaticos();
      return data as unknown as MovimientoNeumatico[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const lista: MovimientoNeumatico[] = registros || [];
  const [busqueda, setBusqueda] = useState("");

  const [editingLog, setEditingLog] = useState<MovimientoNeumatico | null>(null);
  const [editKm, setEditKm] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorTexto, setErrorTexto] = useState("");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-dim">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4"></div>
        <p className="text-sm font-medium animate-pulse">Cargando historial...</p>
      </div>
    );
  }

  const filtrados = busqueda
    ? lista.filter(r =>
        r.buses?.patente.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.usuarios?.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.neumaticos?.codigo_unico.toLowerCase().includes(busqueda.toLowerCase())
      )
    : lista;

  const handleEditClick = (log: MovimientoNeumatico) => {
    setEditingLog(log);
    setEditKm(log.kilometraje_bus_momento.toString());
    setErrorTexto("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;
    setCargando(true);
    setErrorTexto("");

    const cls = await actualizarMovimientoNeumatico(
      editingLog.id,
      parseInt(editKm, 10)
    );

    if (cls.error) {
      setErrorTexto(cls.error);
    } else {
      queryClient.invalidateQueries({ queryKey: ["movimientos_neumaticos"] });
      setEditingLog(null);
    }
    setCargando(false);
  };

  const formatearFecha = (isoString: string) => {
    try {
       const date = new Date(isoString);
       return date.toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
       return isoString;
    }
  };

  const formatearPosicion = (pos: string | null) => {
      if (!pos) return "-";
      return pos.replace(/_/g, " ");
  }

  const accionColor = (accion: string) => {
    if (accion === 'instalacion') return 'text-green';
    if (accion === 'reciclaje') return 'text-red';
    return 'text-accent';
  };

  const inputClasses = "w-full rounded-md bg-surface px-3 py-2 text-[13px] text-foreground placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-accent/30";

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="relative max-w-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-dim">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar patente, mecánico o neumático..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={`${inputClasses} pl-12`}
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-surface rounded-md">
        <table className="w-full text-left text-[13px] text-foreground">
          <thead className="border-b border-border text-[11px] font-medium text-dim uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3">Fecha y Hora</th>
              <th className="px-6 py-3">Mecánico</th>
              <th className="px-6 py-3">Acción</th>
              <th className="px-6 py-3">Neumático</th>
              <th className="px-6 py-3">Bus / KMs</th>
              <th className="px-6 py-3">Movimiento</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {filtrados.map((r) => (
              <tr key={r.id} className="hover:bg-surface-hover transition-colors">
                <td className="whitespace-nowrap px-6 py-3.5 font-mono text-muted">
                  {formatearFecha(r.fecha_hora)}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-foreground">{r.usuarios?.nombre_completo || "Desconocido"}</td>
                <td className="whitespace-nowrap px-6 py-3.5">
                  <span className={`text-[11px] font-medium uppercase tracking-wide ${accionColor(r.accion)}`}>
                    {r.accion}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 font-mono text-xs text-foreground">
                    {r.neumaticos?.codigo_unico || "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-3.5">
                  <span className="font-medium text-foreground">{r.buses?.patente || "N/A"}</span>
                  <div className="text-xs text-dim font-mono mt-0.5">{r.kilometraje_bus_momento.toLocaleString("es-CL")} km</div>
                </td>
                <td className="whitespace-nowrap px-6 py-3.5">
                  <div className="flex flex-col gap-1 text-xs capitalize text-muted">
                    {r.posicion_origen && <div><span className="text-dim">Origen:</span> {formatearPosicion(r.posicion_origen)}</div>}
                    {r.posicion_destino && <div><span className="text-accent">Destino:</span> {formatearPosicion(r.posicion_destino)}</div>}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(r)}
                      disabled={cargando}
                      className="p-1.5 text-dim hover:text-accent transition-colors disabled:opacity-50"
                      title="Editar Kilometraje"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-dim">
                  No se encontraron movimientos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edición */}
      {editingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-surface rounded-md p-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">Corregir Kilometraje</h3>
            <p className="text-sm text-muted mb-6">
              Estás modificando el odómetro registrado durante el cambio en el bus <span className="font-medium text-foreground">{editingLog.buses?.patente}</span>.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-dim mb-1 block">Kilometraje u Odómetro al Movimiento</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={editKm}
                    onChange={(e) => setEditKm(e.target.value)}
                    className={`${inputClasses} font-mono pr-10`}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <span className="text-dim text-sm font-medium">KM</span>
                  </div>
                </div>
              </div>

              {errorTexto && (
                <div className="text-sm text-red">
                  {errorTexto}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  disabled={cargando}
                  className="flex-1 py-2.5 text-[13px] text-dim hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 bg-accent text-background rounded-md py-2.5 text-[13px] font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {cargando ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
