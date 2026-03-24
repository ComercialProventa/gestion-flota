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
      {
        name: "Maestro de Flota",
        href: "/admin/flota",
        desc: "Catálogo maestro de unidades, ejes, marcas y vigencias legales.",
      },
      {
        name: "Inventario de Neumáticos",
        href: "/admin/neumaticos/inventario",
        desc: "Bodega central, stock de llantas nuevas, recapadas y bajas.",
      },
      {
        name: "Modelos y Catálogo",
        href: "/admin/neumaticos/modelos",
        desc: "Gestión técnica de medidas, tipos de terreno y rendimiento esperado.",
      },
    ]
  },
  {
    category: "Ingreso Operativo",
    items: [
      {
        name: "Cargas de Combustible",
        href: "/admin/registros/combustible",
        desc: "Edición manual de cargas de petróleo y odómetros.",
      },
      {
        name: "Movimientos de Neumáticos",
        href: "/admin/registros/neumaticos",
        desc: "Registro de recambios, rotaciones y revisiones de presión en ruta.",
      },
    ]
  },
  {
    category: "Auditoría e Inteligencia",
    items: [
      {
        name: "Centro de Inteligencia",
        href: "/admin/inteligencia",
        desc: "Detección automática de fraudes, rendimiento anómalo y desgaste prematuro.",
      },
      {
        name: "Bitácora del Sistema",
        href: "/admin/auditoria",
        desc: "Trazabilidad detallada de modificaciones críticas en base de datos.",
      },
    ]
  },
  {
    category: "Configuración y Seguridad",
    items: [
      {
        name: "Gestión de Usuarios",
        href: "/admin/usuarios",
        desc: "Creación de cuentas, modificación de credenciales y asignación de roles.",
      },
    ]
  }
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col h-full antialiased p-6">
      
      {/* Header Corporativo Ligero */}
      <header className="mb-8 border-b border-white/5 pb-4 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">Panel de Control General</h1>
          <p className="text-[13px] text-slate-500 font-mono">Índice Operativo</p>
        </div>
        <div className="hidden sm:block">
          <span className="rounded bg-sky-500/10 px-2 py-1 text-[10px] font-bold text-sky-400 tracking-wider">
            ADMINISTRADOR
          </span>
        </div>
      </header>

      {/* Grid Informativo Estricto */}
      <main className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded">
          {MODULES.map((col) => (
            <div key={col.category} className="bg-[#0a0a0a] p-6 lg:p-8">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                {col.category}
              </h2>
              <div className="space-y-4">
                {col.items.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className="group block rounded border border-white/5 bg-[#121214] p-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-[13px] font-semibold text-slate-200 group-hover:text-white">
                        {item.name}
                      </h3>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info adicional bottom */}
        <div className="mt-8 rounded border border-white/5 bg-[#0a0a0a] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] text-slate-400 font-mono">Sistema Operativo</p>
          </div>
          <p className="text-[11px] text-slate-600 font-mono">Mostrando 8 módulos disponibles</p>
        </div>
      </main>

    </div>
  );
}
