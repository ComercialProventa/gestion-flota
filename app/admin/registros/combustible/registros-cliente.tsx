"use client";

import { useState } from "react";
import { actualizarRegistroCombustible, eliminarRegistroCombustible } from "./actions";

type RegistroCombustible = {
  id: string;
  fecha: string;
  hora: string;
  kilometraje: number;
  litros_cargados: number;
  buses?: { patente: string } | null;
  usuarios?: { nombre_completo: string } | null;
};

export default function RegistrosCombustibleCliente({ initialData }: { initialData: any[] }) {
  const [registros, setRegistros] = useState<RegistroCombustible[]>(initialData);
  const [busqueda, setBusqueda] = useState("");
  
  // Modal State
  const [editingLog, setEditingLog] = useState<RegistroCombustible | null>(null);
  const [editLitros, setEditLitros] = useState("");
  const [editKm, setEditKm] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorTexto, setErrorTexto] = useState("");

  const filtrados = busqueda
    ? registros.filter(r => 
        r.buses?.patente.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.usuarios?.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
      )
    : registros;

  const handleEditClick = (log: RegistroCombustible) => {
    setEditingLog(log);
    setEditLitros(log.litros_cargados.toString());
    setEditKm(log.kilometraje.toString());
    setErrorTexto("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;
    setCargando(true);
    setErrorTexto("");

    const cls = await actualizarRegistroCombustible(
      editingLog.id, 
      parseFloat(editLitros), 
      parseInt(editKm, 10)
    );

    if (cls.error) {
      setErrorTexto(cls.error);
    } else {
      // Actualizar local
      setRegistros(prev => prev.map(r => 
        r.id === editingLog.id 
          ? { ...r, litros_cargados: parseFloat(editLitros), kilometraje: parseInt(editKm, 10) } 
          : r
      ));
      setEditingLog(null);
    }
    setCargando(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro operativamente? Quedará un rastro de esto en Auditoría.")) return;
    
    setCargando(true);
    const cls = await eliminarRegistroCombustible(id);
    if (!cls.error) {
        setRegistros(prev => prev.filter(r => r.id !== id));
    } else {
        alert(cls.error);
    }
    setCargando(false);
  };

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
          placeholder="Buscar por patente o conductor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded border border-slate-700 bg-white/[0.02] py-2.5 pl-12 pr-4 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-colors"
        />
      </div>

      {/* Tabla DataGrid */}
      <div className="overflow-x-auto rounded border border-white/5 bg-[#121214]">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-white/5 bg-white/[0.02] text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium">Fecha y Hora</th>
              <th className="px-6 py-3 font-medium">Patente</th>
              <th className="px-6 py-3 font-medium">Conductor</th>
              <th className="px-6 py-3 font-medium">Odómetro</th>
              <th className="px-6 py-3 font-medium">Litros</th>
              <th className="px-6 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filtrados.map((r) => (
              <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="whitespace-nowrap px-6 py-4 font-mono text-slate-400">
                  {r.fecha} <span className="text-slate-500 ml-1">{r.hora.slice(0,5)}</span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/10">
                    {r.buses?.patente || "N/A"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{r.usuarios?.nombre_completo || "Desconocido"}</td>
                <td className="whitespace-nowrap px-6 py-4 font-mono text-indigo-300">
                  {r.kilometraje.toLocaleString("es-CL")} km
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-mono text-emerald-400 font-bold">
                  {r.litros_cargados} L
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(r)}
                      disabled={cargando}
                      className="rounded p-1.5 text-slate-400 hover:bg-white/5 hover:text-indigo-400 transition-colors disabled:opacity-50"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={cargando}
                      className="rounded p-1.5 text-slate-400 hover:bg-white/5 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No se encontraron registros activos.
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
            <h3 className="text-xl font-semibold text-white mb-1">Editar Corrección</h3>
            <p className="text-sm text-slate-400 mb-6">
              Estás modificando la carga del bus <span className="font-bold text-white">{editingLog.buses?.patente}</span> el {editingLog.fecha}.
            </p>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">Litros Cargados</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editLitros}
                    onChange={(e) => setEditLitros(e.target.value)}
                    className="w-full rounded border border-white/10 bg-black/40 p-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-sm font-semibold">L</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">Kilometraje u Odómetro</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={editKm}
                    onChange={(e) => setEditKm(e.target.value)}
                    className="w-full rounded border border-white/10 bg-black/40 p-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
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
                  className="flex-1 rounded bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
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
