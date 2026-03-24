"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { loginAction } from "./actions"; // Descomenta si usas Server Actions para el login

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Aquí debes llamar a tu función de autenticación con Supabase
      // const res = await loginAction(email, password);
      // if (res?.error) throw new Error(res.error);
      // router.push("/admin");

      console.log("Autenticando...");
    } catch (err: any) {
      setError(err.message || "Credenciales inválidas");
      setLoading(false);
    }
  };

  // Clases del sistema de diseño
  const labelClasses = "block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide";
  const inputClasses = "w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 focus:outline-none transition-colors font-mono";

  return (
    <form onSubmit={handleLogin} className="space-y-4">

      {/* Mensaje de Error */}
      {error && (
        <div className="rounded border border-red-500/20 bg-red-500/10 p-2.5 text-[11px] font-medium text-red-400 uppercase tracking-wide text-center">
          {error}
        </div>
      )}

      <div>
        <label className={labelClasses} htmlFor="email">Correo Electrónico</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
          placeholder="usuario@proventa.cl"
          required
        />
      </div>

      <div>
        <label className={labelClasses} htmlFor="password">Contraseña de Acceso</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClasses}
          placeholder="••••••••"
          required
        />
      </div>

      <div className="pt-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verificando
            </>
          ) : (
            "Ingresar al Sistema"
          )}
        </button>
      </div>
    </form>
  );
}