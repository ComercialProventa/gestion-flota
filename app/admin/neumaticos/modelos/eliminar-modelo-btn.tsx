"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarModelo } from "./actions";

export default function EliminarModeloBtn({ modeloId }: { modeloId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => eliminarModelo(modeloId),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidamos la caché: esto hace que ListaModelos se refresque solo
        queryClient.invalidateQueries({ queryKey: ["modelos_neumaticos"] });
      } else {
        alert(result.error);
      }
    }
  });

  return (
    <button
      onClick={() => { if (confirm("¿Eliminar este modelo?")) mutation.mutate() }}
      disabled={mutation.isPending}
      className="text-dim hover:text-red p-1 transition-colors disabled:opacity-30 cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}
