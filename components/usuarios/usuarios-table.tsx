"use client";

import { useState } from "react";

/**
 * Tipo de usuario para la tabla.
 */
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
  administrador: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  administrativo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  taller_conductor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  conductor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
};

/**
 * UsuariosTable — Componente reutilizable de tabla de usuarios.
 *
 * Props:
 * - usuarios: lista de objetos Usuario
 * - esAdmin: si true, muestra columna de Acciones (Editar Perfil, Cambiar Contraseña)
 * - onEditarPerfil: callback cuando se presiona "Editar Perfil"
 * - onCambiarContrasena: callback cuando se presiona "Cambiar Contraseña"
 */
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
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, RUT o correo..."
          className="w-full rounded-lg border border-border-strong bg-surface-overlay pl-10 pr-4 py-2 text-[13px] text-foreground placeholder:text-zinc-500 focus:border-accent focus:ring-1 focus:ring-accent/20 focus:outline-none transition-colors"
        />
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-border-default bg-surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="px-5 py-3 font-medium text-zinc-400">Nombre</th>
                <th className="px-5 py-3 font-medium text-zinc-400">RUT</th>
                <th className="px-5 py-3 font-medium text-zinc-400 hidden md:table-cell">Correo</th>
                <th className="px-5 py-3 font-medium text-zinc-400">Rol</th>
                <th className="px-5 py-3 font-medium text-zinc-400 hidden lg:table-cell">Creado</th>
                {esAdmin && (
                  <th className="px-5 py-3 font-medium text-zinc-400 text-right">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={esAdmin ? 6 : 5}
                    className="px-5 py-8 text-center text-zinc-500"
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filtrados.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border-subtle hover:bg-surface-raised transition-colors"
                  >
                    <td className="px-5 py-3">
                      <p className="font-semibold text-foreground">{u.nombre_completo}</p>
                      <p className="text-xs text-zinc-500 md:hidden">{u.correo}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-zinc-300 text-xs">
                      {u.rut}
                    </td>
                    <td className="px-5 py-3 text-zinc-300 hidden md:table-cell">
                      {u.correo}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          ROLES_COLOR[u.rol] || "bg-zinc-700 text-zinc-300 border-zinc-600"
                        }`}
                      >
                        {ROLES_LABEL[u.rol] || u.rol}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-500 hidden lg:table-cell">
                      {u.creado_en
                        ? new Date(u.creado_en).toLocaleDateString("es-CL")
                        : "—"}
                    </td>
                    {esAdmin && (
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1.5 flex-wrap">
                          {(u.rol === "conductor" || u.rol === "taller_conductor") && (
                            <button
                              type="button"
                              onClick={() => onAsignar?.(u)}
                              className="rounded-lg bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent hover:bg-accent/20 transition-colors cursor-pointer"
                            >
                              Flota
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onEditarPerfil?.(u)}
                            className="rounded-lg bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent hover:bg-accent/20 transition-colors cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onCambiarContrasena?.(u)}
                            className="rounded-lg bg-warning/10 px-2.5 py-1 text-[11px] font-medium text-warning hover:bg-warning/20 transition-colors cursor-pointer"
                          >
                            Password
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-zinc-600 text-center">
        {filtrados.length} de {usuarios.length} usuarios
      </p>
    </div>
  );
}
