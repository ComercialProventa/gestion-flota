export default function LoadingUnidadDetalle() {
    return (
        <main className="mx-auto max-w-5xl px-4 py-8 space-y-6 animate-pulse">

            {/* ─── Cabecera Skeleton ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded bg-white/5 border border-white/10" />
                    <div className="space-y-2">
                        <div className="h-7 w-32 bg-white/10 rounded" />
                        <div className="h-4 w-48 bg-white/5 rounded" />
                    </div>
                </div>
                <div className="h-9 w-28 bg-white/10 rounded" />
            </div>

            {/* ─── Hero Foto Skeleton ─── */}
            <div className="h-64 sm:h-96 w-full rounded-lg bg-white/5 border border-white/10" />

            {/* ─── Grid de Info Técnica ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info General */}
                <div className="lg:col-span-2 rounded-lg border border-white/10 bg-[#151517] p-6 space-y-6">
                    <div className="h-4 w-40 bg-white/10 rounded" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-3 w-16 bg-white/5 rounded" />
                                <div className="h-4 w-24 bg-white/10 rounded" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chasis Box */}
                <div className="rounded-lg border border-white/10 bg-[#151517] p-6 space-y-4">
                    <div className="h-4 w-32 bg-white/10 rounded" />
                    <div className="h-32 w-full bg-black/20 rounded border border-white/5" />
                </div>
            </div>

            {/* ─── Vigencias Skeleton ─── */}
            <div className="rounded-lg border border-white/10 bg-[#151517] p-6 space-y-6">
                <div className="h-4 w-44 bg-white/10 rounded" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="h-24 w-full bg-black/20 rounded border border-white/5" />
                    <div className="h-24 w-full bg-black/20 rounded border border-white/5" />
                </div>
            </div>

        </main>
    );
}