"use client";

import { useState } from "react";
import { actualizarMovimientoNeumatico } from "./actions";

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

export default function RegistrosNeumaticosCliente({ initialData }: { initialData: any[] }) {
  const [registros, setRegistros] = useState<MovimientoNeumatico[]>(initialData);
  const [busqueda, setBusqueda] = useState("");
  
  // Modal State
  const [editingLog, setEditingLog] = useState<MovimientoNeumatico | null>(null);
  const [editKm, setEditKm] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorTexto, setErrorTexto] = useState("");

  const filtrados = busqueda
    ? registros.filter(r => 
        r.buses?.patente.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.usuarios?.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.neumaticos?.codigo_unico.toLowerCase().includes(busqueda.toLowerCase())
      )
    : registros;

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
      setRegistros(prev => prev.map(r => 
        r.id === editingLog.id 
          ? { ...r, kilometraje_bus_momento: parseInt(editKm, 10) } 
          : r
      ));
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

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="relative max-w-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar patente, mecánico o neumático..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded border border-slate-700 bg-white/[0.02] py-2.5 pl-12 pr-4 text-sm text-white placeholder-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-colors"
        />
      </div>

      {/* Tabla DataGrid */}
      <div className="overflow-x-auto rounded border border-white/5 bg-[#121214]">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-white/5 bg-white/[0.02] text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium">Fecha y Hora</th>
              <th className="px-6 py-3 font-medium">Mecánico</th>
              <th className="px-6 py-3 font-medium">Acción</th>
              <th className="px-6 py-3 font-medium">Neumático</th>
              <th className="px-6 py-3 font-medium">Bus / KMs</th>
              <th className="px-6 py-3 font-medium">Movimiento</th>
              <th className="px-6 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filtrados.map((r) => (
              <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="whitespace-nowrap px-6 py-4 font-mono text-slate-400">
                  {formatearFecha(r.fecha_hora)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-300">{r.usuarios?.nombre_completo || "Desconocido"}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    r.accion === 'instalacion' ? 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/20' :
                    r.accion === 'reciclaje' ? 'bg-red-400/10 text-red-400 ring-red-400/20' :
                    'bg-sky-400/10 text-sky-400 ring-sky-400/20'
                  }`}>
                    {r.accion}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-mono text-slate-300">
                    {r.neumaticos?.codigo_unico || "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="font-semibold text-white">{r.buses?.patente || "N/A"}</span>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{r.kilometraje_bus_momento.toLocaleString("es-CL")} km</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs capitalize text-slate-400">
                    {r.posicion_origen && <div><span className="text-slate-500">Origen:</span> {formatearPosicion(r.posicion_origen)}</div>}
                    {r.posicion_destino && <div><span className="text-slate-500 text-violet-400">Destino:</span> {formatearPosicion(r.posicion_destino)}</div>}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(r)}
                      disabled={cargando}
                      className="rounded p-1.5 text-slate-400 hover:bg-white/5 hover:text-violet-400 transition-colors disabled:opacity-50"
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
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No se encontraron movimientos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edición */}
      {editingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded border border-slate-700 bg-slate-800 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-semibold text-white mb-1">Corregir Kilometraje</h3>
            <p className="text-sm text-slate-400 mb-6">
              Estás modificando el odómetro registrado durante el cambio en el bus <span className="font-bold text-white">{editingLog.buses?.patente}</span>.
            </p>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">Kilometraje u Odómetro al Movimiento</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={editKm}
                    onChange={(e) => setEditKm(e.target.value)}
                    className="w-full rounded border border-white/10 bg-black/40 p-3 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none font-mono"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-sm font-semibold">KM</span>
                  </div>
                </div>
              </div>

              {errorTexto && (
                <div className="rounded bg-red-500/10 p-3 border border-red-500/20 text-sm text-red-400">
                  ! {errorTexto}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  disabled={cargando}
                  className="flex-1 rounded border border-white/10 bg-transparent py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 rounded bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition disabled:opacity-50"
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
