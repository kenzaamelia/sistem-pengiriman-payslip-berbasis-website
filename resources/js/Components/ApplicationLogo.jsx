export default function ApplicationLogo({ className = '', light = false }) {
    if (light) {
        return (
            <span className={`inline-flex items-center text-xl font-bold tracking-tight ${className}`}>
                <span className="text-white">Slip</span>
                <span className="text-[#6FC79A]">Gaji</span>
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center text-xl font-bold tracking-tight ${className}`}>
            <span className="text-[#2C5578]">Slip</span>
            <span className="text-[#2E7D52]">Gaji</span>
        </span>
    );
}