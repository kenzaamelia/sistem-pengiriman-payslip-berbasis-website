import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

function AccentBar() {
    return (
        <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#2C5578] to-[#2E7D52]" />
    );
}

export default function Dashboard() {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="mx-auto max-w-5xl space-y-6">
                {/* Banner Selamat Datang */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-[#1B354B] via-[#244663] to-[#2C5578] p-6 text-white shadow-sm sm:p-8">
                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Sistem Siap Digunakan
                        </span>

                        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                            Selamat Datang, {user.name}!
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                            Kelola arsip dan kirim slip gaji karyawan secara otomatis via email dengan alur kerja yang rapi, cepat, dan transparan.
                        </p>
                        <div className="mt-4">
                            <AccentBar />
                        </div>
                    </div>

                    {/* Dekorasi Aksen Lingkaran di Pojok */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#2E7D52]/20 blur-2xl" />
                </div>

                {/* Kartu Menu Cepat */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Kelola Slip Gaji */}
                    <Link
                        href={route('payslips.index')}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 border-l-4 border-l-[#2C5578] bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF1F7] text-[#2C5578] transition group-hover:scale-105">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-[#2C5578] transition group-hover:translate-x-1">
                                &rarr;
                            </span>
                        </div>
                        <h3 className="mt-4 text-base font-bold text-[#14202B]">
                            Kelola Slip Gaji
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            Unggah PDF gabungan, tinjau hasil pembagian berkas, dan kirimkan langsung ke email karyawan.
                        </p>
                    </Link>

                    {/* Data Karyawan */}
                    <Link
                        href={route('employees.index')}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 border-l-4 border-l-[#2E7D52] bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF4EE] text-[#2E7D52] transition group-hover:scale-105">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-[#2E7D52] transition group-hover:translate-x-1">
                                &rarr;
                            </span>
                        </div>
                        <h3 className="mt-4 text-base font-bold text-[#14202B]">
                            Data Karyawan
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            Kelola daftar penerima slip, tambahkan data secara manual, atau import massal via Excel/CSV.
                        </p>
                    </Link>
                </div>

                {/* Petunjuk Ringkas */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                        Alur Pengiriman Cepat
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                            <span className="font-bold text-[#2C5578]">1. Pastikan Karyawan Terdaftar</span>
                            <p className="mt-1 text-xs text-slate-500">
                                Cek kecocokan NIK SAP & email di menu <strong>Data Karyawan</strong>.
                            </p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                            <span className="font-bold text-[#2C5578]">2. Upload Berkas PDF</span>
                            <p className="mt-1 text-xs text-slate-500">
                                Masukkan periode bulan & file PDF gabungan di menu <strong>Kelola Slip Gaji</strong>.
                            </p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                            <span className="font-bold text-[#2E7D52]">3. Verifikasi & Kirim</span>
                            <p className="mt-1 text-xs text-slate-500">
                                Cocokkan slip jika diperlukan, lalu klik tombol <strong>Kirim Semua</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}