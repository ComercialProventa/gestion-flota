"use client";

import { useQuery } from "@tanstack/react-query";
import ChasisPreview from "@/components/buses/chasis-preview";
import DocumentCircularRing from "@/components/ui/DocumentCircularRing";
import { getBusById } from "../actions";

export default function BusDetalleClient({ id }: { id: string }) {
  const { data: bus, isLoading, isError, error } = useQuery({
    queryKey: ["bus", id],
    queryFn: () => getBusById(id),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent mb-4"></div>
          <p className="text-sm font-medium animate-pulse">Cargando ficha del vehículo...</p>
        </div>
      </div>
    );
  }

  if (isError || !bus) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="rounded border border-red-500/20 bg-red-500/10 p-4 text-red-400 max-w-md">
          Error al cargar el vehículo: {error?.message || "No encontrado"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a
              href="/admin/buses"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </a>
            <div>
              <h1 className="text-lg font-semibold text-white font-mono tracking-wider">{bus.patente}</h1>
              <p className="text-xs text-slate-400">{bus.marca} {bus.modelo}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              Información General
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Patente" value={bus.patente} mono />
              <InfoItem label="Marca" value={bus.marca} />
              <InfoItem label="Modelo" value={bus.modelo} />
              <InfoItem label="Año" value={String(bus.ano)} />
              <InfoItem label="Asientos" value={String(bus.asientos)} />
              <InfoItem label="Chasis" value={bus.chasis === "doble_piso_10" ? "Doble Piso (10)" : "Estándar (6)"} />
            </div>

            {bus.foto_url && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-700/30">
                <img
                  src={bus.foto_url}
                  alt={`${bus.marca} ${bus.modelo}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              Configuración de Chasis
            </h2>
            <div className="rounded-xl bg-slate-900/50 p-4">
              <ChasisPreview tipo={bus.chasis || "estandar_6"} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Vigencias Legales
          </h2>

          <div className="flex justify-center gap-8 sm:gap-16">
            <DocumentCircularRing
              nombre="Revisión Técnica"
              fechaVencimiento={bus.vencimiento_revision_tecnica}
              size={140}
            />
            <DocumentCircularRing
              nombre="Seguro Obligatorio"
              fechaVencimiento={bus.vencimiento_seguro}
              size={140}
            />
          </div>

          <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-700/30">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> &gt; 30 días
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> 11–30 días
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> ≤ 10 días
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600">
          Registrado el {bus.creado_en ? new Date(bus.creado_en).toLocaleDateString("es-CL") : "—"}
        </p>
      </main>
    </div>
  );
}

function InfoItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold text-white ${mono ? "font-mono tracking-wider" : ""}`}>
        {value}
      </p>
    </div>
  );
}
