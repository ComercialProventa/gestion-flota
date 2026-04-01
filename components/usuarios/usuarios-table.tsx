"use client";

import { useState } from "react";

export type Usuario = {
  id: string;
  nombre_completo: string;
  rut: string;
  correo: string;
  rol: string;
  creado_en?: string;
};

const ROLES_LABEL: Record<string, string> = {
  administrador: "Administrador",
  administrativo: "Administrativo",
  taller_conductor: "Taller",
  conductor: "Conductor",
};

const ROLES_COLOR: Record<string, string> = {
  administrador: "text-accent",
  administrativo: "text-green",
  taller_conductor: "text-accent",
  conductor: "text-blue",
};

export default function UsuariosTable({
  usuarios,
  esAdmin = false,
  onEditarPerfil,
  onCambiarContrasena,
  onAsignar,
}: {
  usuarios: Usuario[];
  esAdmin?: boolean;
  onEditarPerfil?: (usuario: Usuario) => void;
  onCambiarContrasena?: (usuario: Usuario) => void;
  onAsignar?: (usuario: Usuario) => void;
}) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = usuarios.filter(
    (u) =>
      u.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.rut.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-0">
      {/* Buscador */}
      <div className="mb-5">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, RUT o correo..."
          className="w-full bg-surface rounded-md px-3 py-2 text-[13px] text-foreground placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
        />
      </div>

      {/* Header row */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-medium text-dim uppercase tracking-wide">
        <div className="col-span-3">Nombre</div>
        <div className="col-span-2">RUT</div>
        <div className="col-span-3">Correo</div>
        <div className="col-span-2">Rol</div>
        <div className="col-span-2 text-right">Acciones</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-divider">
        {filtrados.length === 0 ? (
          <div className="py-12 text-center text-dim text-[13px]">
            No se encontraron usuarios
          </div>
        ) : (
          filtrados.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 px-4 py-3 hover:bg-surface transition-colors group"
            >
              {/* Mobile: full row */}
              <div className="md:col-span-3">
                <p className="text-[13px] font-medium text-foreground">{u.nombre_completo}</p>
                <p className="text-[11px] text-dim md:hidden mt-0.5">{u.correo}</p>
              </div>
              <div className="hidden md:block md:col-span-2">
                <span className="text-[12px] font-mono text-muted">{u.rut}</span>
              </div>
              <div className="hidden md:block md:col-span-3">
                <span className="text-[12px] text-muted">{u.correo}</span>
              </div>
              <div className="hidden md:block md:col-span-2">
                <span className={`text-[12px] font-medium ${ROLES_COLOR[u.rol] || "text-muted"}`}>
                  {ROLES_LABEL[u.rol] || u.rol}
                </span>
              </div>
              <div className="md:col-span-2 flex md:justify-end gap-2 mt-1 md:mt-0">
                {(u.rol === "conductor" || u.rol === "taller_conductor") && (
                  <button
                    type="button"
                    onClick={() => onAsignar?.(u)}
                    className="text-[11px] text-dim hover:text-accent transition-colors cursor-pointer"
                  >
                    Flota
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onEditarPerfil?.(u)}
                  className="text-[11px] text-dim hover:text-foreground transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onCambiarContrasena?.(u)}
                  className="text-[11px] text-dim hover:text-foreground transition-colors cursor-pointer"
                >
                  Password
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 text-[11px] text-dim">
        {filtrados.length} de {usuarios.length} usuarios
      </div>
    </div>
  );
}
