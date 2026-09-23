export default function ApplicationLogo({ className = '', light = false }) {
    if (light) {
        return (
            <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight ${className}`}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-[#2E7D52] text-xs font-black text-white shadow-sm">
                    PG
                </div>
                <span className="text-lg">
                    <span className="text-white">PG </span>
                    <span className="text-[#6FC79A]">Pesantren Baru</span>
                </span>
            </div>
        );
    }

    return (
        <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight ${className}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#2C5578] to-[#2E7D52] text-xs font-black text-white shadow-sm">
                PG
            </div>
            <span className="text-lg">
                <span className="text-[#2C5578]">PG </span>
                <span className="text-[#2E7D52]">Pesantren Baru</span>
            </span>
        </div>
    );
}