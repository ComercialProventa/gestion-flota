import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Panel Administrador | Proventa",
  description: "Panel de control central",
};

const MODULES = [
  {
    category: "Logística y Activos",
    items: [
      { name: "Maestro de Flota", href: "/admin/flota", desc: "Unidades, ejes, marcas y vigencias legales." },
      { name: "Inventario de Neumáticos", href: "/admin/neumaticos/inventario", desc: "Bodega central, stock de llantas nuevas, recapadas y bajas." },
      { name: "Modelos y Catálogo", href: "/admin/neumaticos/modelos", desc: "Medidas, tipos de terreno y rendimiento esperado." },
    ],
  },
  {
    category: "Ingreso Operativo",
    items: [
      { name: "Cargas de Combustible", href: "/admin/registros/combustible", desc: "Edición manual de cargas de petróleo y odómetros." },
      { name: "Movimientos de Neumáticos", href: "/admin/registros/neumaticos", desc: "Recambios, rotaciones y revisiones de presión." },
    ],
  },
  {
    category: "Auditoría e Inteligencia",
    items: [
      { name: "Centro de Inteligencia", href: "/admin/inteligencia", desc: "Fraudes, rendimiento anómalo y desgaste prematuro." },
      { name: "Bitácora del Sistema", href: "/admin/auditoria", desc: "Trazabilidad de modificaciones críticas." },
    ],
  },
  {
    category: "Configuración",
    items: [
      { name: "Gestión de Usuarios", href: "/admin/usuarios", desc: "Cuentas, credenciales y roles." },
    ],
  },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="px-8 pt-10 pb-8">
        <p className="text-[11px] font-medium text-accent uppercase tracking-[0.08em] mb-1">
          Panel de Control
        </p>
        <h1 className="text-[22px] font-bold text-foreground tracking-tight">
          Gestión de Flota
        </h1>
        <p className="text-[13px] text-muted mt-1">
          Centro de administración de la operación de buses.
        </p>
      </div>

      {/* Modules - Flat list, no cards */}
      <div className="px-8 pb-12 space-y-8">
        {MODULES.map((col) => (
          <section key={col.category}>
            <h2 className="text-[11px] font-medium text-dim uppercase tracking-[0.06em] mb-3">
              {col.category}
            </h2>
            <div className="space-y-1">
              {col.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-baseline gap-3 py-2.5 px-3 -mx-3 rounded-md hover:bg-surface transition-colors"
                >
                  <span className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors shrink-0">
                    {item.name}
                  </span>
                  <span className="text-[12px] text-dim truncate">
                    {item.desc}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
