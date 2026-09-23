import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-[#14202B]">
                    Informasi Profil
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Perbarui informasi identitas profil akun dan alamat email Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-xs font-semibold text-slate-700" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-[#2C5578] focus:ring-[#2C5578]"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                        placeholder="Nama lengkap Anda"
                    />

                    <InputError className="mt-1.5 text-xs text-red-600" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-xs font-semibold text-slate-700" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full rounded-lg border-slate-300 text-sm focus:border-[#2C5578] focus:ring-[#2C5578]"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="nama@email.com"
                    />

                    <InputError className="mt-1.5 text-xs text-red-600" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg border border-amber-200 bg-[#FBF3E7] p-3 text-xs text-[#7A5215]">
                        <p>
                            Alamat email Anda belum diverifikasi.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-semibold text-[#2C5578] underline hover:text-[#1F3E59] focus:outline-none"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-[#2E7D52]">
                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton
                        disabled={processing}
                        className="rounded-lg bg-[#2C5578] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1F3E59] focus:bg-[#1F3E59] active:bg-[#152B3E] disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Profil'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-x-2"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2E7D52]">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Data profil berhasil disimpan.
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}