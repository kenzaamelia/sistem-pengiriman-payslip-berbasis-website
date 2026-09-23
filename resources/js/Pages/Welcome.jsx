import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Welcome({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk - Sistem Distribusi Slip Gaji" />

            <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#F6F8F7] py-12 sm:px-6 lg:px-8">
                {/* Background Glow Dekoratif */}
                <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#2C5578]/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#2E7D52]/10 blur-3xl" />

                <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60 lg:grid lg:grid-cols-12">
                        
                        {/* Kolom Kiri: Branding & Informasi Alur */}
                        <div className="flex flex-col justify-between border-b border-slate-100 bg-gradient-to-br from-[#1B354B] to-[#2C5578] p-8 text-white sm:p-10 lg:col-span-6 lg:border-b-0 lg:border-r">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-2xl font-bold tracking-tight">
                                        <span className="text-white">Slip</span>
                                        <span className="text-emerald-400">Gaji</span>
                                    </span>
                                </div>

                                <div className="mt-8">
                                    <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                                        Portal Internal SDM
                                    </span>
                                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                        Distribusi slip gaji otomatis & aman.
                                    </h1>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                        Upload satu berkas PDF slip gaji gabungan seluruh karyawan. Sistem akan memisahkan lembaran dokumen per NIK SAP dan mengirimkannya ke email penerima.
                                    </p>
                                </div>
                            </div>

                            {/* Alur ringkas di bagian bawah kolom kiri */}
                            <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
                                <div className="flex items-center gap-3 text-xs text-slate-200">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2E7D52] font-bold text-white">
                                        ✓
                                    </div>
                                    <span>Pemisahan dokumen PDF otomatis per karyawan</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-200">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2E7D52] font-bold text-white">
                                        ✓
                                    </div>
                                    <span>Pengiriman email langsung ke masing-masing karyawan</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-200">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2E7D52] font-bold text-white">
                                        ✓
                                    </div>
                                    <span>Pencatatan riwayat pengiriman transparan & real-time</span>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Form Login */}
                        <div className="flex flex-col justify-center p-8 sm:p-10 lg:col-span-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-[#14202B]">
                                    Selamat Datang
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Silakan masuk ke akun Anda untuk mengelola slip gaji.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-[#2E7D52]">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="email" value="Email Akun" className="text-slate-700" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full rounded-md border-slate-300 focus:border-[#2C5578] focus:ring-[#2C5578]"
                                        autoComplete="username"
                                        isFocused={true}
                                        placeholder="Masukkan Email"
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="Kata Sandi" className="text-slate-700" />
                                    <div className="relative mt-1">
                                        <TextInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            className="block w-full rounded-md border-slate-300 pr-10 focus:border-[#2C5578] focus:ring-[#2C5578]"
                                            autoComplete="current-password"
                                            placeholder="Masukkan Kata Sandi"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                                            tabIndex="-1"
                                            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                        >
                                            {showPassword ? (
                                                /* Icon Eye (Mata Terbuka) - saat teks sandi TERLIHAT */
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            ) : (
                                                /* Icon Eye Slash (Mata Dicoret) - saat teks sandi TIDAK TERLIHAT */
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="rounded border-slate-300 text-[#2C5578] focus:ring-[#2C5578]"
                                        />
                                        <span className="ms-2 text-xs text-slate-600">
                                            Ingat saya
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs font-medium text-[#2C5578] hover:underline"
                                        >
                                            Lupa kata sandi?
                                        </Link>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <PrimaryButton
                                        className="w-full justify-center rounded-md bg-[#2C5578] py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-[#1F3E59] focus:bg-[#1F3E59] active:bg-[#152B3E] disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Memproses Masuk...' : 'Masuk ke Sistem'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}