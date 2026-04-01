"use client";

import { useState, lazy, Suspense } from "react";

const RegistrosCombustibleCliente = lazy(() => import("./combustible/registros-cliente"));
const RegistrosNeumaticosCliente = lazy(() => import("./neumaticos/neumaticos-cliente"));

type Tab = "combustible" | "neumaticos";

const TABS: { id: Tab; label: string }[] = [
  { id: "combustible", label: "Cargas Combustible" },
  { id: "neumaticos", label: "Movs. Neumáticos" },
];

function TabSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-dim">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4"></div>
      <p className="text-sm font-medium animate-pulse">Cargando registros...</p>
    </div>
  );
}

export default function RegistrosTabs() {
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
                  ? "border-accent text-accent bg-transparent"
                  : "border-transparent text-dim hover:text-foreground"
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
            <RegistrosCombustibleCliente />
          </Suspense>
        )}
        {active === "neumaticos" && (
          <Suspense fallback={<TabSkeleton />}>
            <RegistrosNeumaticosCliente />
          </Suspense>
        )}
      </div>
    </div>
  );
}
