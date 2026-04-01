"use client";

import { useState, lazy, Suspense } from "react";

const CombustibleDashboard = lazy(() => import("./combustible/combustible-dashboard"));
const NeumaticosDashboard = lazy(() => import("./neumaticos/neumaticos-dashboard"));
const MantenimientoDashboard = lazy(() => import("./mantenimiento/mantenimiento-dashboard"));

type Tab = "combustible" | "neumaticos" | "mantenimiento";

const TABS: { id: Tab; label: string; accent: string; hoverBg: string }[] = [
  { id: "combustible", label: "Combustible", accent: "border-amber-400 text-amber-400", hoverBg: "hover:text-amber-400" },
  { id: "neumaticos", label: "Neumáticos", accent: "border-emerald-400 text-emerald-400", hoverBg: "hover:text-emerald-400" },
  { id: "mantenimiento", label: "Mantenimiento", accent: "border-sky-400 text-sky-400", hoverBg: "hover:text-sky-400" },
];

function TabSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-dim">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4"></div>
      <p className="text-sm font-medium animate-pulse">Cargando datos...</p>
    </div>
  );
}

export default function IntelTabs() {
  const [active, setActive] = useState<Tab>("combustible");

  return (
    <div>
      <div className="flex gap-0 border-b border-divider mb-8">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
                isActive
                  ? `${tab.accent} bg-transparent`
                  : `border-transparent text-dim ${tab.hoverBg}`
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>
        {active === "combustible" && (
          <Suspense fallback={<TabSkeleton />}>
            <CombustibleDashboard />
          </Suspense>
        )}
        {active === "neumaticos" && (
          <Suspense fallback={<TabSkeleton />}>
            <NeumaticosDashboard />
          </Suspense>
        )}
        {active === "mantenimiento" && (
          <Suspense fallback={<TabSkeleton />}>
            <MantenimientoDashboard />
          </Suspense>
        )}
      </div>
    </div>
  );
}
