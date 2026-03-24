"use client";

import { useState } from "react";
import { login } from "./actions"; // Importamos tu función real

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // 1. Llamamos a tu base de datos de verdad
    const result = await login(formData);

    // 2. Si hay error, quitamos el "Verificando..." y mostramos el mensaje
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Nota: Si el login es exitoso, Next.js hace un "redirect" automático 
    // desde el servidor, por lo que no necesitamos un setLoading(false) aquí.
  }

  // Clases del sistema de diseño (minimalista, oscuro y con toques rojos)
  const labelClasses = "block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide";
  const inputClasses = "w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-red-600 focus:ring-1 focus:ring-red-600/30 focus:outline-none transition-colors font-mono";

  return (
    <form action={handleSubmit} className="space-y-4">

      {/* Mensaje de Error */}
      {error && (
        <div className="rounded border border-red-500/20 bg-red-500/10 p-2.5 text-[11px] font-medium text-red-400 uppercase tracking-wide text-center">
          {error}
        </div>
      )}

      {/* Campo Email */}
      <div>
        <label htmlFor="email" className={labelClasses}>Correo Electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="usuario@proventa.cl"
          className={inputClasses}
        />
      </div>

      {/* Campo Contraseña */}
      <div>
        <label htmlFor="password" className={labelClasses}>Contraseña de Acceso</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className={inputClasses}
        />
      </div>

      {/* Botón de envío */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded bg-red-700 py-2.5 text-sm font-semibold text-white hover:bg-red-600 focus:ring-2 focus:ring-red-600/50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verificando...
            </>
          ) : (
            "Ingresar al Sistema"
          )}
        </button>
      </div>
    </form>
  );
}