export default function LoadingInteligencia() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <div className="h-7 w-64 rounded-md bg-surface animate-pulse" />
        <div className="h-4 w-48 rounded-md bg-surface animate-pulse mt-2" />
      </header>

      <main className="px-8 pb-12">
        {/* Tabs skeleton */}
        <div className="flex gap-4 mb-8 border-b border-divider pb-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-28 rounded bg-surface animate-pulse" />
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="flex gap-3 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-7 w-20 rounded bg-surface animate-pulse" />
          ))}
        </div>

        {/* KPIs skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 rounded bg-surface animate-pulse" />
              <div className="h-6 w-24 rounded bg-surface animate-pulse" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-40 rounded bg-surface animate-pulse" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 rounded-md bg-surface animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  );
}
