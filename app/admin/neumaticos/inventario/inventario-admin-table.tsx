"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNeumaticos, getInventarioCounts, registrarIngresoBodega, editarNeumaticoBodega, eliminarNeumaticoBodega } from "./actions";

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
  { key: "todos", label: "Todos", color: "text-foreground" },
  { key: "inventario", label: "En Bodega", color: "text-green" },
  { key: "instalado", label: "Instalados", color: "text-accent" },
  { key: "reciclaje", label: "De Baja", color: "text-red" },
];

const ESTADO_LABEL: Record<string, string> = {
  inventario: "Bodega",
  instalado: "Instalado",
  reciclaje: "De Baja",
  bodega: "Bodega",
};

const ESTADO_COLOR: Record<string, string> = {
  inventario: "text-green",
  instalado: "text-accent",
  reciclaje: "text-red",
  bodega: "text-green",
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
  modelos,
}: {
  modelos: { id: string; marca: string; medida: string }[];
}) {
  const queryClient = useQueryClient();

  const { data: neumaticos, isLoading } = useQuery<NeumaticoAdmin[]>({
    queryKey: ["neumaticos_inventario"],
    queryFn: async () => {
      const data = await getNeumaticos();
      return data as unknown as NeumaticoAdmin[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: counts } = useQuery<{ inventario: number; instalado: number; reciclaje: number }>({
    queryKey: ["neumaticos_counts"],
    queryFn: getInventarioCounts,
    staleTime: 1000 * 60 * 5,
  });

  const neumaticosData = neumaticos || [];
  const countsData = counts || { inventario: 0, instalado: 0, reciclaje: 0 };

  const [filtro, setFiltro] = useState<FiltroEstado>("todos");
  const [busqueda, setBusqueda] = useState("");

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

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    let lista = neumaticosData;
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
  }, [neumaticosData, filtro, busqueda]);

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
      queryClient.invalidateQueries({ queryKey: ["neumaticos_inventario"] });
      queryClient.invalidateQueries({ queryKey: ["neumaticos_counts"] });
    }
    setCargandoIngreso(false);
  };

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
      queryClient.invalidateQueries({ queryKey: ["neumaticos_inventario"] });
    }
    setCargandoEdit(false);
  };

  const handleEliminar = async (id: string) => {
    if (!window.confirm("¿Estás súper seguro de eliminar este registro de neumático de forma permanente?")) return;
    setDeletingId(id);
    const cls = await eliminarNeumaticoBodega(id);
    if (cls.error) {
      alert(cls.error);
    } else {
      queryClient.invalidateQueries({ queryKey: ["neumaticos_inventario"] });
      queryClient.invalidateQueries({ queryKey: ["neumaticos_counts"] });
    }
    setDeletingId(null);
  };

  const getCount = (key: FiltroEstado) => {
    if (key === "todos") return neumaticosData.length;
    return countsData[key] || 0;
  };

  const labelClasses = "block text-[11px] font-medium text-dim mb-1";
  const inputClasses = "w-full rounded-md bg-surface px-3 py-2 text-[13px] text-foreground placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-accent/30";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-dim">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4"></div>
        <p className="text-sm font-medium animate-pulse">Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-md flex flex-col">

      {/* Barra de filtros + búsqueda */}
      <div className="border-b border-border p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium transition-colors cursor-pointer ${filtro === f.key
                  ? f.color
                  : "text-dim hover:text-foreground"
                }`}
            >
              {f.label}
              <span className="text-[11px] text-dim">
                {getCount(f.key)}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="relative flex-1 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            className="flex w-full sm:w-auto items-center justify-center gap-2 bg-accent text-background rounded-md px-4 py-2 text-[13px] font-medium hover:bg-accent-hover transition-colors whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Registrar Ingreso
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px] text-foreground">
          <thead className="text-[11px] font-medium text-dim uppercase tracking-wide border-b border-border">
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
          <tbody className="divide-y divide-divider">
            {filtrados.map((n) => (
              <tr key={n.id} className="hover:bg-surface-hover transition-colors group">
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs font-medium text-foreground">
                    {n.codigo_unico}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-mono text-xs text-foreground">
                    {n.numero_serie || <span className="text-dim italic">S/N</span>}
                  </div>
                  {n.codigo_dot && (
                    <div className="text-[10px] text-dim mt-0.5 font-mono">DOT: {n.codigo_dot}</div>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-medium text-foreground">{n.modelos_neumaticos?.marca || "Desconocida"}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-xs text-muted">{n.modelos_neumaticos?.medida || "Desconocida"}</span>
                    <span className="text-[10px] text-dim uppercase tracking-wide">· {CICLO_LABEL[n.ciclo_vida] || n.ciclo_vida}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-medium uppercase tracking-wide ${ESTADO_COLOR[n.estado] || "text-dim"}`}>
                    {ESTADO_LABEL[n.estado] || n.estado}
                  </span>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  {n.estado === "instalado" && n.buses ? (
                    <div>
                      <span className="font-mono text-xs font-medium text-accent">{n.buses.patente}</span>
                      {n.posicion_actual && (
                        <div className="text-[10px] text-dim mt-0.5 uppercase tracking-wide">{POSICION_LABEL[n.posicion_actual] || n.posicion_actual}</div>
                      )}
                    </div>
                  ) : n.estado === "reciclaje" ? (
                    <span className="text-xs text-dim italic">Retirado</span>
                  ) : (
                    <span className="text-xs text-dim">En bodega</span>
                  )}
                </td>
                <td className="px-5 py-3.5 hidden xl:table-cell">
                  {n.usuarios ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">{n.usuarios.nombre_completo.split(" ")[0]}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-dim italic">Sistema</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => abrirEdicion(n)}
                      className="p-1.5 text-dim hover:text-accent transition-colors"
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
                        className="p-1.5 text-dim hover:text-red transition-colors disabled:opacity-50"
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
                  <p className="text-sm text-muted">No se encontraron resultados</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con conteo */}
      <div className="border-t border-border px-5 py-3 text-xs text-dim">
        Mostrando <span className="text-foreground">{filtrados.length}</span> de {neumaticosData.length} registros
      </div>

      {/* MODAL: REGISTRAR INGRESO */}
      {mostrarModalIngreso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface rounded-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-foreground mb-1">Registrar Ingreso a Bodega</h3>
            <p className="text-xs text-muted mb-5">Completa este formulario al recepcionar nuevas llantas comerciales.</p>

            <form onSubmit={handleIngresarBodega} className="space-y-4">
              <div>
                <label className={labelClasses}>Modelo / Medida</label>
                <select
                  required
                  value={formIngreso.modeloId}
                  onChange={(e) => setFormIngreso({ ...formIngreso, modeloId: e.target.value })}
                  className={inputClasses}
                >
                  <option value="">Selecciona un modelo...</option>
                  {modelos.map(m => (
                    <option key={m.id} value={m.id}>{m.marca} - {m.medida}</option>
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
                <div className="text-sm text-red">
                  {errorIngreso}
                </div>
              )}

              <div className="flex gap-3 pt-3 mt-2">
                <button
                  type="button"
                  onClick={() => setMostrarModalIngreso(false)}
                  disabled={cargandoIngreso}
                  className="flex-1 py-2.5 text-[13px] text-dim hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargandoIngreso}
                  className="flex-1 bg-accent text-background rounded-md py-2.5 text-[13px] font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {cargandoIngreso ? "Procesando..." : "Ingresar a Bodega"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR NEUMÁTICO */}
      {editingNeumatico && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface rounded-md p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-semibold text-foreground mb-1">Editar Neumático</h3>
            <p className="text-xs text-muted mb-5">
              Modificando el neumático <span className="font-mono text-foreground">{editingNeumatico.codigo_unico}</span>.
            </p>

            <form onSubmit={handleEditar} className="space-y-4">
              <div>
                <label className={labelClasses}>Modelo / Marca</label>
                <select
                  required
                  value={formEdit.modeloId}
                  onChange={(e) => setFormEdit({ ...formEdit, modeloId: e.target.value })}
                  className={inputClasses}
                >
                  <option value="">Selecciona un modelo...</option>
                  {modelos.map(m => (
                    <option key={m.id} value={m.id}>{m.marca} - {m.medida}</option>
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
                    className={`${inputClasses} font-mono`}
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
                    className={`${inputClasses} font-mono`}
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
                    className={inputClasses}
                    placeholder="Ej: F-1020"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Proveedor</label>
                  <input
                    type="text"
                    value={formEdit.proveedor}
                    onChange={(e) => setFormEdit({ ...formEdit, proveedor: e.target.value })}
                    className={inputClasses}
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
                  className={`${inputClasses} font-mono`}
                />
              </div>

              {errorEdit && (
                <div className="text-sm text-red">
                  {errorEdit}
                </div>
              )}

              <div className="flex gap-3 pt-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingNeumatico(null)}
                  disabled={cargandoEdit}
                  className="flex-1 py-2.5 text-[13px] text-dim hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargandoEdit}
                  className="flex-1 bg-accent text-background rounded-md py-2.5 text-[13px] font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
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
