export default function LoadingModelos() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased animate-pulse">
      <div className="mx-auto max-w-6xl w-full space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-5">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded border border-white/10 bg-white/5" />
            <div className="space-y-2">
              <div className="h-8 w-64 bg-white/5 rounded" />
              <div className="h-4 w-96 bg-white/5 rounded" />
            </div>
          </div>
          <div className="h-16 w-32 bg-white/5 border border-white/10 rounded-lg" />
        </div>

        {/* Form Skeleton */}
        <div className="rounded-lg border border-white/10 bg-[#151517] p-5">
           <div className="h-6 w-48 mb-6 bg-white/5 rounded" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="h-12 bg-white/5 rounded" />
             <div className="h-12 bg-white/5 rounded" />
             <div className="h-12 bg-white/5 rounded" />
             <div className="h-12 bg-white/5 rounded" />
           </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 rounded-xl border border-white/10 bg-[#1a1a1c]" />
          ))}
        </div>
      </div>
    </div>
  );
}
