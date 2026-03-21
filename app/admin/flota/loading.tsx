export default function FlotaLoading() {
  return (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-700/50 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-32 rounded bg-slate-700/50 animate-pulse" />
              <div className="h-3 w-24 rounded bg-slate-700/50 animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-32 rounded-xl bg-sky-600/50 animate-pulse" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="space-y-6">
          <div className="h-12 w-full max-w-md rounded-2xl bg-slate-800/80 animate-pulse" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 h-[400px]">
                {/* Cabecera Fotográfica Placeholder */}
                <div className="h-48 w-full bg-slate-700/50 animate-pulse" />
                
                {/* Cuerpo Placeholder */}
                <div className="flex flex-1 flex-col p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-5 w-24 bg-slate-700/50 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-slate-700/50 rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-12 bg-slate-700/50 rounded-lg animate-pulse" />
                  </div>
                  
                  <div className="mt-auto space-y-3">
                    <div className="h-8 w-full bg-slate-700/50 rounded-lg animate-pulse" />
                    <div className="h-8 w-full bg-slate-700/50 rounded-lg animate-pulse" />
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-700/30">
                    <div className="h-8 flex-1 bg-slate-700/30 rounded-lg animate-pulse" />
                    <div className="h-8 flex-1 bg-red-600/10 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
