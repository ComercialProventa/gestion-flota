export default function LoadingRegistrosCombustible() {
  return (
    <div className="flex flex-col h-full space-y-6 p-4 md:p-6 lg:p-8 antialiased animate-pulse">
      <header className="flex items-center justify-between pb-4">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
          <div className="h-8 w-8 rounded-md bg-surface" />
          <div className="space-y-2">
            <div className="h-6 w-56 rounded-md bg-surface" />
            <div className="h-4 w-40 rounded-md bg-surface" />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-6xl mt-6">
         <div className="rounded-md bg-surface overflow-hidden">
           <div className="flex items-center justify-between p-4">
              <div className="h-10 w-64 rounded-md bg-surface-hover" />
              <div className="h-10 w-32 rounded-md bg-surface-hover" />
           </div>
           <div className="p-4 space-y-3">
             {[1, 2, 3, 4, 5, 6, 7].map((i) => (
               <div key={i} className="h-12 w-full rounded-md bg-surface-hover" />
             ))}
           </div>
         </div>
      </main>
    </div>
  );
}
