import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

function NavItems() {
    const navLinks = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: 'Kelola Slip Gaji',
            href: route('payslips.index'),
            active: route().current('payslips.index'),
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            name: 'Data Karyawan',
            href: route('employees.index'),
            active: route().current('employees.index'),
            icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
    ];

    return (
        <nav className="space-y-1.5 px-3">
            {navLinks.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg py-2.5 px-3 text-sm font-medium transition-all ${
                        item.active
                            ? 'border-l-4 border-[#2E7D52] bg-white/15 font-semibold text-white shadow-sm'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                        {item.icon}
                    </span>
                    {item.name}
                </Link>
            ))}
        </nav>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F6F8F7] text-[#14202B] font-['Figtree',sans-serif] lg:flex">
            {/* Top bar khusus mobile */}
            <div className="flex items-center justify-between border-b border-black/10 bg-[#1B354B] px-4 py-3 text-white lg:hidden">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E7D52] font-bold text-white">
                        S
                    </div>
                    <span className="font-bold tracking-tight">
                        <span className="text-white">Slip</span>
                        <span className="text-emerald-400">Gaji</span>
                    </span>
                </Link>

                <button
                    onClick={() => setMobileOpen((v) => !v)}
                    className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                >
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        {mobileOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {mobileOpen && (
                <div className="border-b border-black/10 bg-[#1B354B] py-3 lg:hidden">
                    <NavItems />
                </div>
            )}

            {/* Sidebar Desktop */}
            <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:bg-gradient-to-b lg:from-[#1B354B] lg:via-[#244663] lg:to-[#1F3E59] shadow-md">
                {/* Logo Section */}
                <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-[#2E7D52] font-bold text-white shadow-sm">
                        SG
                    </div>
                    <Link href="/" className="text-xl font-bold tracking-tight text-white">
                        Slip<span className="text-emerald-400">Gaji</span>
                    </Link>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-5">
                    <NavItems />
                </div>

                {/* User Info & Profile Menu */}
                <div className="shrink-0 border-t border-white/10 p-4">
                    <div className="mb-3 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2C5578] to-[#2E7D52] text-xs font-bold text-white shadow-inner">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-semibold text-white">{user.name}</div>
                            <div className="truncate text-[11px] text-white/60">{user.email}</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between px-1">
                        <Link
                            href={route('profile.edit')}
                            className="rounded px-2 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                            Profil Akun
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="rounded px-2 py-1 text-xs font-medium text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
                        >
                            Keluar
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Area Konten Utama */}
            <div className="flex-1 lg:min-w-0">
                {header && (
                    <header className="border-b border-slate-200/80 bg-white px-6 py-4 shadow-sm sm:px-8">
                        <div className="text-lg font-bold tracking-tight text-[#14202B]">
                            {header}
                        </div>
                    </header>
                )}

                <main className="p-6 sm:p-8">{children}</main>
            </div>
        </div>
    );
}