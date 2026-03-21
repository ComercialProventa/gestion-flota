"use client";

import { useState } from "react";
import UsuariosTable, { type Usuario } from "@/components/usuarios/usuarios-table";
import { actualizarPerfilUsuario, cambiarContrasenaUsuario } from "./actions";

/**
 * Client Component wrapper que maneja los modales de edición y contraseña.
 *
 * Separa la lista (Server Component la pasa como prop) de la interactividad
 * (modales, formularios, callbacks) para mantener el patrón RSC/CC.
 */
export default function UsuariosAdmin({ usuarios }: { usuarios: Usuario[] }) {
  // ─── Modales ──────────────────────────────────────────────
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [cambiandoPwd, setCambiandoPwd] = useState<Usuario | null>(null);

  // ─── Estado de formularios ─────────────────────────────────
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editExito, setEditExito] = useState(false);

  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdExito, setPwdExito] = useState(false);

  // ─── Guardar cambios de perfil ────────────────────────────
  async function handleGuardarPerfil(formData: FormData) {
    setEditLoading(true);
    setEditError(null);
    setEditExito(false);

    formData.set("usuario_id", editando!.id);
    const result = await actualizarPerfilUsuario(formData);

    setEditLoading(false);

    if (result.error) {
      setEditError(result.error);
    } else {
      setEditExito(true);
      setTimeout(() => {
        setEditando(null);
        setEditExito(false);
      }, 1200);
    }
  }

  // ─── Cambiar contraseña ───────────────────────────────────
  async function handleCambiarPwd(formData: FormData) {
    const pwd = formData.get("nueva_contrasena") as string;
    if (!pwd || pwd.length < 8) {
      setPwdError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setPwdLoading(true);
    setPwdError(null);
    setPwdExito(false);

    const result = await cambiarContrasenaUsuario(cambiandoPwd!.id, pwd);

    setPwdLoading(false);

    if (result.error) {
      setPwdError(result.error);
    } else {
      setPwdExito(true);
      setTimeout(() => {
        setCambiandoPwd(null);
        setPwdExito(false);
      }, 1200);
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors";

  return (
    <>
      <UsuariosTable
        usuarios={usuarios}
        esAdmin={true}
        onEditarPerfil={(u) => {
          setEditError(null);
          setEditExito(false);
          setEditando(u);
        }}
        onCambiarContrasena={(u) => {
          setPwdError(null);
          setPwdExito(false);
          setCambiandoPwd(u);
        }}
      />

      {/* ═══════════════════════════════════════════════════════
          MODAL: EDITAR PERFIL
          ═══════════════════════════════════════════════════════ */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600/20 text-sky-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Editar Perfil</h3>
                <p className="text-xs text-slate-400">{editando.correo}</p>
              </div>
            </div>

            {editExito && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-400">
                ✅ Perfil actualizado exitosamente
              </div>
            )}
            {editError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-400">
                ❌ {editError}
              </div>
            )}

            <form action={handleGuardarPerfil} className="space-y-4">
              <div>
                <label htmlFor="edit-nombre" className="block text-xs font-medium text-slate-400 mb-1">Nombre Completo</label>
                <input id="edit-nombre" name="nombre_completo" type="text" required defaultValue={editando.nombre_completo} className={inputClasses} />
              </div>
              <div>
                <label htmlFor="edit-rut" className="block text-xs font-medium text-slate-400 mb-1">RUT</label>
                <input id="edit-rut" name="rut" type="text" required defaultValue={editando.rut} className={inputClasses} />
              </div>
              <div>
                <label htmlFor="edit-rol" className="block text-xs font-medium text-slate-400 mb-1">Rol</label>
                <select id="edit-rol" name="rol" required defaultValue={editando.rol} className={inputClasses}>
                  <option value="administrador">Administrador</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="taller_conductor">Taller / Conductor</option>
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  disabled={editLoading}
                  className="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {editLoading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          MODAL: CAMBIAR CONTRASEÑA
          ═══════════════════════════════════════════════════════ */}
      {cambiandoPwd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Cambiar Contraseña</h3>
                <p className="text-xs text-slate-400">{cambiandoPwd.nombre_completo} ({cambiandoPwd.correo})</p>
              </div>
            </div>

            {pwdExito && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-400">
                ✅ Contraseña actualizada exitosamente
              </div>
            )}
            {pwdError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-400">
                ❌ {pwdError}
              </div>
            )}

            <form action={handleCambiarPwd} className="space-y-4">
              <div>
                <label htmlFor="nueva-pwd" className="block text-xs font-medium text-slate-400 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  id="nueva-pwd"
                  name="nueva_contrasena"
                  type="text"
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className={`${inputClasses} font-mono`}
                />
                <p className="mt-1 text-xs text-slate-500">
                  El usuario deberá iniciar sesión con esta nueva contraseña.
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setCambiandoPwd(null)}
                  disabled={pwdLoading}
                  className="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="flex-1 rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-600/25 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {pwdLoading ? "Cambiando..." : "Cambiar Contraseña"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
