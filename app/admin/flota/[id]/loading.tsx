export default function LoadingUnidadDetalle() {
    return (
        <main className="mx-auto max-w-5xl px-4 py-8 space-y-6 animate-pulse">

            {/* ─── Cabecera Skeleton ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-md bg-surface" />
                    <div className="space-y-2">
                        <div className="h-7 w-32 bg-surface rounded-md" />
                        <div className="h-4 w-48 bg-surface rounded-md" />
                    </div>
                </div>
                <div className="h-9 w-28 bg-surface rounded-md" />
            </div>

            {/* ─── Hero Foto Skeleton ─── */}
            <div className="h-64 sm:h-96 w-full rounded-md bg-surface" />

            {/* ─── Grid de Info Técnica ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info General */}
                <div className="lg:col-span-2 rounded-md bg-surface p-6 space-y-6">
                    <div className="h-4 w-40 bg-surface-hover rounded-md" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-3 w-16 bg-surface-hover rounded-md" />
                                <div className="h-4 w-24 bg-surface-hover rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chasis Box */}
                <div className="rounded-md bg-surface p-6 space-y-4">
                    <div className="h-4 w-32 bg-surface-hover rounded-md" />
                    <div className="h-32 w-full bg-surface-hover rounded-md" />
                </div>
            </div>

            {/* ─── Vigencias Skeleton ─── */}
            <div className="rounded-md bg-surface p-6 space-y-6">
                <div className="h-4 w-44 bg-surface-hover rounded-md" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="h-24 w-full bg-surface-hover rounded-md" />
                    <div className="h-24 w-full bg-surface-hover rounded-md" />
                </div>
            </div>

        </main>
    );
}
