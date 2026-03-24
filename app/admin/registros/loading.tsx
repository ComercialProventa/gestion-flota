export default function LoadingRegistrosDashboard() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased animate-pulse">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-3">
          <div className="h-8 w-8 rounded border border-white/10 bg-white/5" />
          <div className="space-y-2">
            <div className="h-6 w-56 rounded bg-white/5" />
            <div className="h-4 w-40 rounded bg-white/5" />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-5xl mt-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Cargas de Combustible */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-6">
            <div className="mb-3 h-10 w-10 rounded-lg bg-indigo-600/10" />
            <div className="h-5 w-48 rounded bg-white/5 mb-2" />
            <div className="h-4 w-64 rounded bg-white/5" />
          </div>

          {/* Movimientos Neumáticos */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-6">
            <div className="mb-3 h-10 w-10 rounded-lg bg-violet-600/10" />
            <div className="h-5 w-48 rounded bg-white/5 mb-2" />
            <div className="h-4 w-64 rounded bg-white/5" />
          </div>
        </div>
      </main>
    </div>
  );
}
