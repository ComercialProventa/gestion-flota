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
      <div className="py-12 text-center text-dim text-[13px]">
        Cargando usuarios...
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
  const labelClasses = "block text-[11px] font-medium text-dim mb-1";
  const inputClasses = "w-full bg-surface rounded-md px-3 py-2 text-[13px] text-foreground placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-surface rounded-lg p-6 space-y-5">
            <div>
              <h3 className="text-[15px] font-semibold text-foreground">Editar Usuario</h3>
              <p className="text-[12px] text-dim font-mono mt-0.5">{editando.correo}</p>
            </div>

            {editExito && <div className="text-[12px] text-green">Cambios guardados.</div>}
            {editError && <div className="text-[12px] text-red">{editError}</div>}

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
                  <option value="administrador" className="bg-surface">Administrador</option>
                  <option value="administrativo" className="bg-surface">Administrativo</option>
                  <option value="taller_conductor" className="bg-surface">Taller</option>
                  <option value="conductor" className="bg-surface">Conductor</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditando(null)} className="flex-1 py-2 text-[13px] text-dim hover:text-foreground transition-colors">Cancelar</button>
                <button type="submit" disabled={editLoading} className="flex-1 py-2 text-[13px] font-medium text-accent hover:text-accent-hover transition-colors">
                  {editLoading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CAMBIAR PWD */}
      {cambiandoPwd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-surface rounded-lg p-6 space-y-5">
            <h3 className="text-[15px] font-semibold text-foreground">Nueva Contraseña</h3>

            {pwdExito && <div className="text-[12px] text-green">Contraseña actualizada.</div>}
            {pwdError && <div className="text-[12px] text-red">{pwdError}</div>}

            <form action={handleCambiarPwd} className="space-y-4">
              <div>
                <label className={labelClasses}>Contraseña Nueva</label>
                <input name="nueva_contrasena" type="password" required minLength={8} placeholder="Mínimo 8 caracteres" className={inputClasses} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setCambiandoPwd(null)} className="flex-1 py-2 text-[13px] text-dim hover:text-foreground transition-colors">Cancelar</button>
                <button type="submit" disabled={pwdLoading} className="flex-1 py-2 text-[13px] font-medium text-accent hover:text-accent-hover transition-colors">
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