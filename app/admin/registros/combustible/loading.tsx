export default function LoadingRegistrosCombustible() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased animate-pulse">
      <header className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
          <div className="h-8 w-8 rounded border border-white/10 bg-indigo-500/10" />
          <div className="space-y-2">
            <div className="h-6 w-56 rounded bg-indigo-500/10" />
            <div className="h-4 w-40 rounded bg-white/5" />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-6xl mt-6">
         <div className="rounded-xl border border-white/5 bg-slate-800/30 overflow-hidden">
           <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="h-10 w-64 rounded bg-white/5" />
              <div className="h-10 w-32 rounded bg-white/5" />
           </div>
           <div className="p-4 space-y-3">
             {[1, 2, 3, 4, 5, 6, 7].map((i) => (
               <div key={i} className="h-12 w-full rounded bg-white/5" />
             ))}
           </div>
         </div>
      </main>
    </div>
  );
}
