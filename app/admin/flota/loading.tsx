export default function LoadingFlota({ isNested }: { isNested?: boolean }) {
  return (
    <div className={isNested ? "animate-pulse" : "mx-auto max-w-7xl px-4 py-8 space-y-6 animate-pulse"}>
      {/* Skeleton del header */}
      {!isNested && (
        <div className="flex justify-between items-end pb-5 mb-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-surface rounded-md" />
            <div className="h-4 w-32 bg-surface rounded-md" />
          </div>
          <div className="h-10 w-32 bg-surface rounded-md" />
        </div>
      )}

      {/* Skeleton de la cuadrícula de buses */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 w-full bg-surface rounded-md" />
        ))}
      </div>
    </div>
  );
}
