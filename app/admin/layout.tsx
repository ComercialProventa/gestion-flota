import type { Metadata } from "next";
import AdminSidebar from "@/components/admin-sidebar"; // Ajusta la ruta según donde guardaste el sidebar
import Providers from '@/app/providers'
export const metadata: Metadata = {
    title: "Panel Administrador | Gestión de Flota",
    description: "Panel de control del administrador del sistema",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Providers>
            {/* Contenedor principal: Ocupa toda la pantalla y usa flexbox para alinear Sidebar y Contenido */}
            <div className="flex min-h-screen bg-[#0a0a0a]">

                {/* El Sidebar a la izquierda (Oculto en móviles, visible en Desktop) */}
                <AdminSidebar />

                {/* El área principal de contenido a la derecha */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Header móvil (Solo visible en pantallas pequeñas cuando el sidebar se oculta) */}
                    <header className="md:hidden flex h-14 items-center border-b border-white/5 bg-[#0a0a0a] px-4">
                        <span className="text-sm font-bold text-white">Proventa Admin</span>
                    </header>

                    {/* Aquí es donde Next.js inyectará el contenido de tus páginas (page.tsx) */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>

                </div>
            </div>
        </Providers>
    );
}