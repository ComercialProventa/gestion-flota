export default function LoadingInteligenciaHub() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased animate-pulse">
      <header className="flex items-center justify-between pb-4">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-md bg-surface" />
            <div className="space-y-2">
              <div className="h-6 w-64 rounded-md bg-surface" />
              <div className="h-4 w-48 rounded-md bg-surface" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-5xl mt-6">
        {/* Banner skeleton */}
        <div className="mb-8 h-24 rounded-md bg-surface" />

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-md bg-surface p-6 h-48" />
          ))}
        </div>

        {/* Resumen skeleton */}
        <div className="mt-8 h-20 rounded-md bg-surface" />
      </main>
    </div>
  );
}
