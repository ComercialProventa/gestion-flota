export default function LoadingUsuarios() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-8 space-y-6 animate-pulse">
            <div className="h-20 w-full bg-surface rounded-md" />
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-14 w-full bg-surface rounded-md" />
                ))}
            </div>
        </div>
    );
}
