export default function LoadingInventario() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-md bg-surface" />
            <div className="space-y-2">
              <div className="h-5 w-48 rounded-md bg-surface" />
              <div className="h-3 w-32 rounded-md bg-surface" />
            </div>
          </div>
          <div className="h-8 w-24 rounded-md bg-surface" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 w-full mx-auto max-w-7xl mt-6">
        {/* Table skeleton */}
        <div className="rounded-md bg-surface overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="h-8 w-64 rounded-md bg-surface-hover" />
            <div className="h-8 w-32 rounded-md bg-surface-hover" />
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div key={row} className="flex gap-4">
                <div className="h-10 flex-1 rounded-md bg-surface-hover" />
                <div className="h-10 w-24 rounded-md bg-surface-hover" />
                <div className="h-10 w-32 rounded-md bg-surface-hover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
