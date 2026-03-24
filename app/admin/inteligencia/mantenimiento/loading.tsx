export default function LoadingInteligenciaMantenimiento() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased animate-pulse">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded border border-white/10 bg-sky-500/10" />
            <div className="space-y-2">
              <div className="h-6 w-64 rounded bg-sky-500/10" />
              <div className="h-4 w-48 rounded bg-white/5" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-6xl mt-6 space-y-6">
         {/* Top Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1, 2, 3].map((i) => (
             <div key={i} className="h-32 rounded border border-white/5 bg-slate-800/30" />
           ))}
         </div>
         {/* Main Chart */}
         <div className="h-96 rounded border border-white/5 bg-slate-800/30" />
      </main>
    </div>
  );
}
