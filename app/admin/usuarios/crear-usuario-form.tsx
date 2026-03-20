"use client";

import { useState } from "react";
import { crearUsuario } from "./actions";

/**
 * Client Component — Formulario para crear un nuevo usuario.
 *
 * Usa "use client" porque necesita:
 * - Estado de React para loading, errores y resultado (contraseña generada)
 * - Interactividad del formulario
 *
 * Cuando el usuario se crea exitosamente, muestra la contraseña generada
 * en un panel visible para que el admin la copie y la comunique al empleado.
 */
export default function CrearUsuarioForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{
    contrasena: string;
    mensaje: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setResultado(null);

    const result = await crearUsuario(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setResultado({
        contrasena: result.contrasena!,
        mensaje: result.mensaje!,
      });
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Mensaje de éxito con la contraseña generada */}
      {resultado && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-emerald-400">{resultado.mensaje}</p>
          </div>
          <div className="rounded-lg bg-slate-900/50 p-4">
            <p className="text-sm text-slate-400 mb-1">Contraseña generada:</p>
            <p className="font-mono text-lg font-bold text-white tracking-wider">
              {resultado.contrasena}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              ⚠️ Anota esta contraseña. No se podrá visualizar nuevamente.
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Formulario */}
      <form action={handleSubmit} className="space-y-5">
        {/* Nombre Completo */}
        <div>
          <label htmlFor="nombre_completo" className="block text-sm font-medium text-slate-300 mb-1.5">
            Nombre Completo
          </label>
          <input
            id="nombre_completo"
            name="nombre_completo"
            type="text"
            required
            placeholder="Ej: Juan Pérez González"
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-white placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors"
          />
        </div>

        {/* RUT */}
        <div>
          <label htmlFor="rut" className="block text-sm font-medium text-slate-300 mb-1.5">
            RUT
          </label>
          <input
            id="rut"
            name="rut"
            type="text"
            required
            placeholder="Ej: 12.345.678-9"
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-white placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors"
          />
        </div>

        {/* Correo Electrónico */}
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-slate-300 mb-1.5">
            Correo Electrónico
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            required
            placeholder="Ej: juan.perez@empresa.cl"
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-white placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors"
          />
        </div>

        {/* Rol */}
        <div>
          <label htmlFor="rol" className="block text-sm font-medium text-slate-300 mb-1.5">
            Rol
          </label>
          <select
            id="rol"
            name="rol"
            required
            defaultValue=""
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-colors"
          >
            <option value="" disabled>
              Selecciona un rol
            </option>
            <option value="administrador">Administrador</option>
            <option value="administrativo">Administrativo</option>
            <option value="taller_conductor">Taller / Conductor</option>
          </select>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creando usuario...
            </span>
          ) : (
            "Crear Usuario"
          )}
        </button>
      </form>
    </div>
  );
}
