import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Lupa Kata Sandi - Sistem Distribusi Slip Gaji" />

            <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#F6F8F7] py-12 sm:px-6 lg:px-8">
                {/* Background Glow Dekoratif */}
                <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#2C5578]/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#2E7D52]/10 blur-3xl" />

                <div className="relative mx-auto w-full max-w-md px-4 sm:px-0">
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 border-t-4 border-t-[#2C5578] bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">
                        
                        {/* Logo & Header */}
                        <div className="mb-6">
                            <Link href="/" className="inline-flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#2C5578] to-[#2E7D52] shadow-sm shadow-[#2C5578]/20">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold tracking-tight">
                                    <span className="text-[#2C5578]">Slip</span>
                                    <span className="text-[#2E7D52]">Gaji</span>
                                </span>
                            </Link>

                            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#14202B]">
                                Lupa Kata Sandi?
                            </h2>
                            <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                Tidak masalah. Masukkan alamat email akun Anda yang terdaftar, dan kami akan mengirimkan tautan reset kata sandi ke kotak masuk email Anda.
                            </p>
                        </div>

                        {/* Status Notifikasi Berhasil */}
                        {status && (
                            <div className="mb-5 rounded-lg border border-emerald-200 bg-[#EAF4EE] px-4 py-3 text-xs font-semibold text-[#215D3D]">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="email" value="Email Akun" className="text-xs font-semibold text-slate-700" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="nama@email.com"
                                    className="mt-1 block w-full rounded-md border-slate-300 text-sm focus:border-[#2C5578] focus:ring-[#2C5578]"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-1.5" />
                            </div>

                            <div className="pt-2">
                                <PrimaryButton
                                    className="w-full justify-center rounded-md bg-[#2C5578] py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-[#1F3E59] focus:bg-[#1F3E59] active:bg-[#152B3E] disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? 'Mengirim Tautan...' : 'Kirim Tautan Reset Sandi'}
                                </PrimaryButton>
                            </div>

                            <div className="text-center pt-2">
                                <Link
                                    href="/"
                                    className="text-xs font-medium text-slate-500 hover:text-[#2C5578] hover:underline"
                                >
                                    &larr; Kembali ke Halaman Masuk
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}