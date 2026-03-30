"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UsuariosTable, { type Usuario } from "@/components/usuarios/usuarios-table";
import { getUsuarios, actualizarPerfilUsuario, cambiarContrasenaUsuario } from "./actions";
import AsignacionBusesModal from "./asignacion-buses-modal";

export default function UsuariosAdmin() {
  const { data: usuarios, isLoading } = useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const data = await getUsuarios();
      return (data || []) as Usuario[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const lista: Usuario[] = usuarios || [];

  // ── TODOS LOS HOOKS ANTES DE CUALQUIER RETURN CONDICIONAL ──
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [cambiandoPwd, setCambiandoPwd] = useState<Usuario | null>(null);
  const [asignando, setAsignando] = useState<Usuario | null>(null);

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editExito, setEditExito] = useState(false);

  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdExito, setPwdExito] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent mb-4"></div>
        <p className="text-sm font-medium animate-pulse">Cargando usuarios...</p>
      </div>
    );
  }

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
      setTimeout(() => { setEditando(null); setEditExito(false); }, 1200);
    }
  }

  async function handleCambiarPwd(formData: FormData) {
    const pwd = formData.get("nueva_contrasena") as string;
    if (!pwd || pwd.length < 8) {
      setPwdError("Mínimo 8 caracteres.");
      return;
    }
    setPwdLoading(true);
    const result = await cambiarContrasenaUsuario(cambiandoPwd!.id, pwd);
    setPwdLoading(false);

    if (result.error) {
      setPwdError(result.error);
    } else {
      setPwdExito(true);
      setTimeout(() => { setCambiandoPwd(null); setPwdExito(false); }, 1200);
    }
  }

  // Clases del Sistema de Diseño Técnico
  const labelClasses = "block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider";
  const inputClasses = "w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 focus:outline-none transition-all";

  return (
    <>
      <UsuariosTable
        usuarios={lista}
        esAdmin={true}
        onEditarPerfil={(u) => { setEditError(null); setEditando(u); }}
        onCambiarContrasena={(u) => { setPwdError(null); setCambiandoPwd(u); }}
        onAsignar={(u) => setAsignando(u)}
      />

      {/* MODAL: EDITAR PERFIL */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded border border-white/5 bg-[#121214] p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Editar Usuario</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">{editando.correo}</p>
            </div>

            {editExito && <div className="text-[12px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded">Cambios guardados.</div>}
            {editError && <div className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded">{editError}</div>}

            <form action={handleGuardarPerfil} className="space-y-4">
              <div>
                <label className={labelClasses}>Nombre Completo</label>
                <input name="nombre_completo" type="text" required defaultValue={editando.nombre_completo} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>RUT</label>
                <input name="rut" type="text" required defaultValue={editando.rut} className={`${inputClasses} font-mono`} />
              </div>
              <div>
                <label className={labelClasses}>Rol de Acceso</label>
                <select name="rol" required defaultValue={editando.rol} className={inputClasses}>
                  <option value="administrador" className="bg-slate-900">Administrador</option>
                  <option value="administrativo" className="bg-slate-900">Administrativo</option>
                  <option value="taller_conductor" className="bg-slate-900">Taller</option>
                  <option value="conductor" className="bg-slate-900">Conductor</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditando(null)} className="flex-1 rounded border border-white/10 py-2 text-sm font-medium text-slate-400 hover:bg-white/5 transition-colors">Cancelar</button>
                <button type="submit" disabled={editLoading} className="flex-1 rounded bg-sky-600 py-2 text-sm font-semibold text-white hover:bg-sky-500 transition-colors">
                  {editLoading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CAMBIAR PWD */}
      {cambiandoPwd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded border border-white/5 bg-[#121214] p-6 shadow-xl space-y-5">
            <h3 className="text-lg font-bold text-white tracking-tight">Nueva Contraseña</h3>

            {pwdExito && <div className="text-[12px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded">Contraseña actualizada.</div>}
            {pwdError && <div className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded">{pwdError}</div>}

            <form action={handleCambiarPwd} className="space-y-4">
              <div>
                <label className={labelClasses}>Contraseña Nueva</label>
                <input name="nueva_contrasena" type="password" required minLength={8} placeholder="Mínimo 8 caracteres" className={inputClasses} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setCambiandoPwd(null)} className="flex-1 rounded border border-white/10 py-2 text-sm font-medium text-slate-400 hover:bg-white/5 transition-colors">Cancelar</button>
                <button type="submit" disabled={pwdLoading} className="flex-1 rounded bg-amber-600 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition-colors">
                  {pwdLoading ? "Cambiando..." : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {asignando && <AsignacionBusesModal usuario={asignando} onCerrar={() => setAsignando(null)} />}
    </>
  );
}