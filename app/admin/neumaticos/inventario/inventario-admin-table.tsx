"use client";

import { useMemo, useState } from "react";
import { registrarIngresoBodega, editarNeumaticoBodega, eliminarNeumaticoBodega } from "./actions";

export type NeumaticoAdmin = {
  id: string;
  codigo_unico: string;
  numero_serie: string | null;
  codigo_dot: string | null;
  ciclo_vida: string;
  estado: string;
  posicion_actual: string | null;
  desgaste_acumulado_km: number | null;
  factura_numero: string | null;
  proveedor: string | null;
  precio: number | null;
  creado_en: string;
  modelos_neumaticos: { id?: string; marca: string; medida: string } | null;
  usuarios: { nombre_completo: string } | null;
  buses: { patente: string } | null;
};

type FiltroEstado = "todos" | "inventario" | "instalado" | "reciclaje";

const FILTROS: { key: FiltroEstado; label: string; color: string }[] = [
  { key: "todos", label: "Todos", color: "bg-white/10 text-white" },
  { key: "inventario", label: "En Bodega", color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  { key: "instalado", label: "Instalados", color: "bg-sky-500/10 text-sky-400 border border-sky-500/20" },
  { key: "reciclaje", label: "De Baja", color: "bg-red-500/10 text-red-400 border border-red-500/20" },
];

const ESTADO_LABEL: Record<string, string> = {
  inventario: "Bodega",
  instalado: "Instalado",
  reciclaje: "De Baja",
  bodega: "Bodega",
};

const ESTADO_STYLES: Record<string, string> = {
  inventario: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  instalado: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  reciclaje: "bg-red-500/10 text-red-400 border border-red-500/20",
  bodega: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};

const CICLO_LABEL: Record<string, string> = {
  nuevo: "Nuevo",
  recapado_1: "Recap. 1",
  recapado_2: "Recap. 2",
  recapado_3: "Recap. 3",
};

const POSICION_LABEL: Record<string, string> = {
  delantero_izquierdo: "Del. Izq.",
  delantero_derecho: "Del. Der.",
  trasero_exterior_izquierdo: "Tras. Ext. Izq.",
  trasero_interior_izquierdo: "Tras. Int. Izq.",
  trasero_interior_derecho: "Tras. Int. Der.",
  trasero_exterior_derecho: "Tras. Ext. Der.",
};

export default function InventarioAdminTable({
  neumaticos,
  counts,
  modelos,
}: {
  neumaticos: NeumaticoAdmin[];
  counts: { inventario: number; instalado: number; reciclaje: number };
  modelos: { id: string; marca: string; medida: string }[];
}) {
  const [filtro, setFiltro] = useState<FiltroEstado>("todos");
  const [busqueda, setBusqueda] = useState("");

  // Modal Ingreso a Bodega
  const [mostrarModalIngreso, setMostrarModalIngreso] = useState(false);
  const [cargandoIngreso, setCargandoIngreso] = useState(false);
  const [errorIngreso, setErrorIngreso] = useState("");

  const [formIngreso, setFormIngreso] = useState({
    modeloId: "",
    cantidad: 1,
    factura: "",
    proveedor: "",
    precio: 0,
  });

  const handleIngresarBodega = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIngreso.modeloId) {
      setErrorIngreso("Debes seleccionar un modelo.");
      return;
    }
    setCargandoIngreso(true);
    setErrorIngreso("");

    const cls = await registrarIngresoBodega({
      modeloId: formIngreso.modeloId,
      cantidad: formIngreso.cantidad,
      factura: formIngreso.factura || null,
      proveedor: formIngreso.proveedor || null,
      precio: formIngreso.precio,
    });

    if (cls.error) {
      setErrorIngreso(cls.error);
    } else {
      setMostrarModalIngreso(false);
      setFormIngreso({ modeloId: "", cantidad: 1, factura: "", proveedor: "", precio: 0 });
    }
    setCargandoIngreso(false);
  };

  // Modal de Edición
  const [editingNeumatico, setEditingNeumatico] = useState<NeumaticoAdmin | null>(null);
  const [formEdit, setFormEdit] = useState({
    modeloId: "",
    numeroSerie: "",
    codigoDot: "",
    factura: "",
    proveedor: "",
    precio: 0,
  });
  const [cargandoEdit, setCargandoEdit] = useState(false);
  const [errorEdit, setErrorEdit] = useState("");

  const abrirEdicion = (n: NeumaticoAdmin) => {
    setEditingNeumatico(n);
    setFormEdit({
      modeloId: n.modelos_neumaticos?.id || "",
      numeroSerie: n.numero_serie || "",
      codigoDot: n.codigo_dot || "",
      factura: n.factura_numero || "",
      proveedor: n.proveedor || "",
      precio: n.precio || 0,
    });
    setErrorEdit("");
  };

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNeumatico) return;
    setCargandoEdit(true);
    setErrorEdit("");

    const cls = await editarNeumaticoBodega(editingNeumatico.id, {
      modeloId: formEdit.modeloId,
      numeroSerie: formEdit.numeroSerie || null,
      codigoDot: formEdit.codigoDot || null,
      factura: formEdit.factura || null,
      proveedor: formEdit.proveedor || null,
      precio: formEdit.precio,
    });

    if (cls.error) {
      setErrorEdit(cls.error);
    } else {
      setEditingNeumatico(null);
    }
    setCargandoEdit(false);
  };

  // Eliminación Segura
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleEliminar = async (id: string) => {
    if (!window.confirm("¿Estás súper seguro de eliminar este registro de neumático de forma permanente?")) return;
    setDeletingId(id);
    const cls = await eliminarNeumaticoBodega(id);
    if (cls.error) {
      alert(cls.error);
    }
    setDeletingId(null);
  };

  const filtrados = useMemo(() => {
    let lista = neumaticos;
    if (filtro !== "todos") {
      lista = lista.filter((n) => n.estado === filtro);
    }
    const q = busqueda.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter(
      (n) =>
        n.codigo_unico.toLowerCase().includes(q) ||
        (n.numero_serie && n.numero_serie.toLowerCase().includes(q)) ||
        (n.codigo_dot && n.codigo_dot.toLowerCase().includes(q)) ||
        (n.modelos_neumaticos && n.modelos_neumaticos.marca.toLowerCase().includes(q)) ||
        (n.modelos_neumaticos && n.modelos_neumaticos.medida.toLowerCase().includes(q)) ||
        (n.buses && n.buses.patente.toLowerCase().includes(q)) ||
        (n.usuarios && n.usuarios.nombre_completo.toLowerCase().includes(q))
    );
  }, [neumaticos, filtro, busqueda]);

  const getCount = (key: FiltroEstado) => {
    if (key === "todos") return neumaticos.length;
    return counts[key] || 0;
  };

  // Clases compartidas del sistema de diseño
  const labelClasses = "block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide";
  const inputClasses = "w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none transition-colors";
  const inputClassesEdit = "w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 focus:outline-none transition-colors";

  return (
    <div className="rounded-lg border border-white/10 bg-[#151517] shadow-sm flex flex-col">

      {/* Barra de filtros + búsqueda */}
      <div className="border-b border-white/5 bg-white/[0.02] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${filtro === f.key
                  ? f.color
                  : "bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-300"
                }`}
            >
              {f.label}
              <span className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] border border-white/5">
                {getCount(f.key)}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="relative flex-1 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por código, serie, marca, patente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className={`${inputClasses} pl-9`}
            />
          </div>
          <button
            onClick={() => setMostrarModalIngreso(true)}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Registrar Ingreso
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-black/20 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5">
            <tr>
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Serie / DOT</th>
              <th className="px-5 py-3">Marca / Medida</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 hidden lg:table-cell">Ubicación</th>
              <th className="px-5 py-3 hidden xl:table-cell">Registrado Por</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtrados.map((n) => (
              <tr key={n.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs font-bold text-white bg-black/40 px-2 py-1 rounded border border-white/10">
                    {n.codigo_unico}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-mono text-xs text-slate-300">
                    {n.numero_serie || <span className="text-slate-500 italic">S/N</span>}
                  </div>
                  {n.codigo_dot && (
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">DOT: {n.codigo_dot}</div>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-medium text-slate-200">{n.modelos_neumaticos?.marca || "Desconocida"}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-xs text-slate-400">{n.modelos_neumaticos?.medida || "Desconocida"}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">· {CICLO_LABEL[n.ciclo_vida] || n.ciclo_vida}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${ESTADO_STYLES[n.estado] || "bg-black/40 text-slate-400 border border-white/10"}`}>
                    {ESTADO_LABEL[n.estado] || n.estado}
                  </span>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  {n.estado === "instalado" && n.buses ? (
                    <div>
                      <span className="font-mono text-xs font-bold text-sky-400">{n.buses.patente}</span>
                      {n.posicion_actual && (
                        <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">{POSICION_LABEL[n.posicion_actual] || n.posicion_actual}</div>
                      )}
                    </div>
                  ) : n.estado === "reciclaje" ? (
                    <span className="text-xs text-slate-500 italic">Retirado</span>
                  ) : (
                    <span className="text-xs text-slate-500">En bodega</span>
                  )}
                </td>
                <td className="px-5 py-3.5 hidden xl:table-cell">
                  {n.usuarios ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-white/5 border border-white/10 text-[9px] font-bold text-slate-300">
                        {n.usuarios.nombre_completo.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-slate-400">{n.usuarios.nombre_completo.split(" ")[0]}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Sistema</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => abrirEdicion(n)}
                      className="rounded p-1.5 text-slate-500 hover:bg-white/5 hover:text-sky-400 transition-colors"
                      title="Editar Propiedades"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    {n.estado === "inventario" && (
                      <button
                        onClick={() => handleEliminar(n.id)}
                        disabled={deletingId === n.id}
                        className="rounded p-1.5 text-slate-500 hover:bg-white/5 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Borrado Seguro"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <p className="text-sm font-medium text-slate-400">No se encontraron resultados</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con conteo */}
      <div className="border-t border-white/5 bg-black/20 px-5 py-3 text-xs font-medium text-slate-500">
        Mostrando <span className="text-slate-300">{filtrados.length}</span> de {neumaticos.length} registros
      </div>

      {/* =========================================
          MODAL: REGISTRAR INGRESO
      ========================================= */}
      {mostrarModalIngreso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-lg border border-white/10 bg-[#151517] p-5 shadow-lg animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-1">Registrar Ingreso a Bodega</h3>
            <p className="text-xs text-slate-400 mb-5">Completa este formulario al recepcionar nuevas llantas comerciales.</p>

            <form onSubmit={handleIngresarBodega} className="space-y-4">
              <div>
                <label className={labelClasses}>Modelo / Medida</label>
                <select
                  required
                  value={formIngreso.modeloId}
                  onChange={(e) => setFormIngreso({ ...formIngreso, modeloId: e.target.value })}
                  className={inputClasses}
                >
                  <option value="" className="bg-slate-800">Selecciona un modelo...</option>
                  {modelos.map(m => (
                    <option key={m.id} value={m.id} className="bg-slate-800">{m.marca} - {m.medida}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Cantidad Unidades</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formIngreso.cantidad}
                    onChange={(e) => setFormIngreso({ ...formIngreso, cantidad: parseInt(e.target.value) || 1 })}
                    className={`${inputClasses} font-mono`}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Precio Unitario ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formIngreso.precio || ""}
                    onChange={(e) => setFormIngreso({ ...formIngreso, precio: parseInt(e.target.value) || 0 })}
                    className={`${inputClasses} font-mono`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Proveedor (Opcional)</label>
                  <input
                    type="text"
                    value={formIngreso.proveedor}
                    onChange={(e) => setFormIngreso({ ...formIngreso, proveedor: e.target.value })}
                    className={inputClasses}
                    placeholder="Ej: Comercial Salfa"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Factura N° (Opcional)</label>
                  <input
                    type="text"
                    value={formIngreso.factura}
                    onChange={(e) => setFormIngreso({ ...formIngreso, factura: e.target.value })}
                    className={inputClasses}
                    placeholder="Ej: F-10293"
                  />
                </div>
              </div>

              {errorIngreso && (
                <div className="rounded border border-red-500/20 bg-red-500/10 p-2.5 text-sm text-red-400">
                  {errorIngreso}
                </div>
              )}

              <div className="flex gap-3 pt-3 mt-2">
                <button
                  type="button"
                  onClick={() => setMostrarModalIngreso(false)}
                  disabled={cargandoIngreso}
                  className="flex-1 rounded border border-white/10 bg-transparent py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargandoIngreso}
                  className="flex-1 rounded bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors disabled:opacity-50"
                >
                  {cargandoIngreso ? "Procesando..." : "Ingresar a Bodega"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: EDITAR NEUMÁTICO
      ========================================= */}
      {editingNeumatico && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-lg border border-white/10 bg-[#151517] p-5 shadow-lg overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-semibold text-white mb-1">Editar Neumático</h3>
            <p className="text-xs text-slate-400 mb-5">
              Modificando el neumático <span className="font-mono text-slate-300">{editingNeumatico.codigo_unico}</span>.
            </p>

            <form onSubmit={handleEditar} className="space-y-4">
              <div>
                <label className={labelClasses}>Modelo / Marca</label>
                <select
                  required
                  value={formEdit.modeloId}
                  onChange={(e) => setFormEdit({ ...formEdit, modeloId: e.target.value })}
                  className={inputClassesEdit}
                >
                  <option value="" className="bg-slate-800">Selecciona un modelo...</option>
                  {modelos.map(m => (
                    <option key={m.id} value={m.id} className="bg-slate-800">{m.marca} - {m.medida}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Número Serie</label>
                  <input
                    type="text"
                    value={formEdit.numeroSerie}
                    onChange={(e) => setFormEdit({ ...formEdit, numeroSerie: e.target.value })}
                    className={`${inputClassesEdit} font-mono`}
                    placeholder="S/N"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Código DOT</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formEdit.codigoDot}
                    onChange={(e) => setFormEdit({ ...formEdit, codigoDot: e.target.value })}
                    className={`${inputClassesEdit} font-mono`}
                    placeholder="Semana/Año"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Factura</label>
                  <input
                    type="text"
                    value={formEdit.factura}
                    onChange={(e) => setFormEdit({ ...formEdit, factura: e.target.value })}
                    className={inputClassesEdit}
                    placeholder="Ej: F-1020"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Proveedor</label>
                  <input
                    type="text"
                    value={formEdit.proveedor}
                    onChange={(e) => setFormEdit({ ...formEdit, proveedor: e.target.value })}
                    className={inputClassesEdit}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Precio de Adquisición ($)</label>
                <input
                  type="number"
                  min="0"
                  value={formEdit.precio || ""}
                  onChange={(e) => setFormEdit({ ...formEdit, precio: parseInt(e.target.value) || 0 })}
                  className={`${inputClassesEdit} font-mono`}
                />
              </div>

              {errorEdit && (
                <div className="rounded border border-red-500/20 bg-red-500/10 p-2.5 text-sm text-red-400">
                  {errorEdit}
                </div>
              )}

              <div className="flex gap-3 pt-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingNeumatico(null)}
                  disabled={cargandoEdit}
                  className="flex-1 rounded border border-white/10 bg-transparent py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargandoEdit}
                  className="flex-1 rounded bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition-colors disabled:opacity-50"
                >
                  {cargandoEdit ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}