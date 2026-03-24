export default function LoadingInventario() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded border border-white/10 bg-white/5" />
            <div className="space-y-2">
              <div className="h-5 w-48 rounded bg-white/5" />
              <div className="h-3 w-32 rounded bg-white/5" />
            </div>
          </div>
          <div className="h-8 w-24 rounded-lg bg-sky-600/10 border border-sky-600/30" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 w-full mx-auto max-w-7xl mt-6">
        {/* Table skeleton */}
        <div className="rounded-xl border border-white/10 bg-slate-800/30 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="h-8 w-64 rounded bg-white/5" />
            <div className="h-8 w-32 rounded bg-white/5" />
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div key={row} className="flex gap-4">
                <div className="h-10 flex-1 rounded bg-white/5" />
                <div className="h-10 w-24 rounded bg-white/5" />
                <div className="h-10 w-32 rounded bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
