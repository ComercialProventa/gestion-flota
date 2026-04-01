import type { Metadata } from "next";
import AdminSidebar from "@/components/admin-sidebar";
import Providers from "@/app/providers";

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
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden flex h-12 items-center px-4">
            <span className="text-sm font-semibold text-foreground">Proventa</span>
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
