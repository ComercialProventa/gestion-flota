"use client";

import { eliminarModelo } from "./actions";
import { useState } from "react";

/**
 * Client Component — Botón para eliminar un modelo de neumático.
 *
 * Muestra confirmación antes de eliminar y maneja errores
 * (ej: FK violation si hay neumáticos usando el modelo).
 */
export default function EliminarModeloBtn({ modeloId }: { modeloId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEliminar() {
    if (!confirm("¿Estás seguro de eliminar este modelo?")) return;

    setLoading(true);
    setError(null);

    const result = await eliminarModelo(modeloId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
    // Si fue exitoso, revalidatePath se encarga del refresh
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleEliminar}
        disabled={loading}
        className="rounded-lg bg-red-600/20 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-600/30 disabled:opacity-50 transition-colors cursor-pointer"
      >
        {loading ? "..." : "Eliminar"}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
