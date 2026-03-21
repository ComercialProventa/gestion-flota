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
  taller_conductor: "Taller / Conductor",
};

const ROLES_COLOR: Record<string, string> = {
  administrador: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  administrativo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  taller_conductor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
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
}: {
  usuarios: Usuario[];
  esAdmin?: boolean;
  onEditarPerfil?: (usuario: Usuario) => void;
  onCambiarContrasena?: (usuario: Usuario) => void;
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
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
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
          className="w-full rounded-xl border border-slate-600 bg-slate-700/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors"
        />
      </div>

      {/* Tabla */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-left">
                <th className="px-5 py-3 font-medium text-slate-400">Nombre</th>
                <th className="px-5 py-3 font-medium text-slate-400">RUT</th>
                <th className="px-5 py-3 font-medium text-slate-400 hidden md:table-cell">Correo</th>
                <th className="px-5 py-3 font-medium text-slate-400">Rol</th>
                <th className="px-5 py-3 font-medium text-slate-400 hidden lg:table-cell">Creado</th>
                {esAdmin && (
                  <th className="px-5 py-3 font-medium text-slate-400 text-right">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={esAdmin ? 6 : 5}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filtrados.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <p className="font-semibold text-white">{u.nombre_completo}</p>
                      <p className="text-xs text-slate-500 md:hidden">{u.correo}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-300 text-xs">
                      {u.rut}
                    </td>
                    <td className="px-5 py-3 text-slate-300 hidden md:table-cell">
                      {u.correo}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          ROLES_COLOR[u.rol] || "bg-slate-700 text-slate-300 border-slate-600"
                        }`}
                      >
                        {ROLES_LABEL[u.rol] || u.rol}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500 hidden lg:table-cell">
                      {u.creado_en
                        ? new Date(u.creado_en).toLocaleDateString("es-CL")
                        : "—"}
                    </td>
                    {esAdmin && (
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onEditarPerfil?.(u)}
                            className="rounded-lg bg-sky-600/20 px-2.5 py-1.5 text-xs font-medium text-sky-400 hover:bg-sky-600/30 transition-colors cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onCambiarContrasena?.(u)}
                            className="rounded-lg bg-amber-600/20 px-2.5 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-600/30 transition-colors cursor-pointer"
                          >
                            Contraseña
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

      <p className="text-xs text-slate-600 text-center">
        {filtrados.length} de {usuarios.length} usuarios
      </p>
    </div>
  );
}
