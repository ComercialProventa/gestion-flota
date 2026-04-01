export default function LoadingRegistros() {
  return (
    <div className="max-w-5xl">
      <header className="px-8 pt-10 pb-6">
        <div className="h-7 w-56 rounded-md bg-surface animate-pulse" />
        <div className="h-4 w-40 rounded-md bg-surface animate-pulse mt-2" />
      </header>

      <main className="px-8 pb-12">
        {/* Tabs skeleton */}
        <div className="flex gap-4 mb-8 border-b border-divider pb-2.5">
          {[1, 2].map((i) => (
            <div key={i} className="h-5 w-32 rounded bg-surface animate-pulse" />
          ))}
        </div>

        {/* Search skeleton */}
        <div className="h-9 w-64 rounded-md bg-surface animate-pulse mb-6" />

        {/* Table skeleton */}
        <div className="bg-surface rounded-md overflow-hidden">
          <div className="h-10 bg-surface-hover" />
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-12 border-t border-divider" />
          ))}
        </div>
      </main>
    </div>
  );
}
