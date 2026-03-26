'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
    // Inicializamos el cliente una sola vez por sesión
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Aquí está la magia: los datos se consideran "frescos" por 5 minutos.
                        // Si navegas a otra página y vuelves antes de 5 mins, la carga es instantánea desde la caché.
                        staleTime: 1000 * 60 * 5,
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}