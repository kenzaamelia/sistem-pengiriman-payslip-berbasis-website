import { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function AccentBar() {
    return (
        <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#2C5578] to-[#2E7D52]" />
    );
}

function PageHeader({ title, subtitle }) {
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-[#14202B]">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            <div className="mt-3">
                <AccentBar />
            </div>
        </div>
    );
}

function FlashBanner() {
    const { flash } = usePage().props;
    if (!flash?.success && !flash?.warning) return null;

    const isWarning = Boolean(flash.warning);
    return (
        <div
            className={`mb-6 rounded-xl border-l-4 px-4 py-3 text-sm shadow-sm ${
                isWarning
                    ? 'border-l-[#B97A1F] bg-[#FBF3E7] text-[#7A5215]'
                    : 'border-l-[#2E7D52] bg-[#EAF4EE] text-[#215D3D]'
            }`}
        >
            {isWarning ? flash.warning : flash.success}
        </div>
    );
}

function StatusPill({ children, tone }) {
    const tones = {
        green: 'bg-[#EAF4EE] text-[#215D3D] border border-emerald-200/60',
        amber: 'bg-[#FBF3E7] text-[#7A5215] border border-amber-200/60',
        red: 'bg-red-50 text-red-700 border border-red-200/60',
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold ${tones[tone]}`}>
            {children}
        </span>
    );
}

function SendStatusPill({ status }) {
    if (status === 'terkirim' || status === 'sent') return <StatusPill tone="green">Terkirim</StatusPill>;
    if (status === 'batal' || status === 'failed') return <StatusPill tone="red">Batal</StatusPill>;
    return <StatusPill tone="amber">Pending</StatusPill>;
}

// Helper untuk format YYYY-MM menjadi nama bulan Indonesia (cth: "September 2026")
function formatPeriode(periodeStr) {
    if (!periodeStr) return '-';
    const parts = periodeStr.split('-');
    if (parts.length < 2) return periodeStr;
    const date = new Date(parts[0], parseInt(parts[1], 10) - 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

export default function Index({ unmatched, matched, employees }) {
    const uploadForm = useForm({ file: null, periode: '' });
    const matchForm = useForm({ employee_id: '' });
    const [activeUnmatchedId, setActiveUnmatchedId] = useState(null);

    const pendingOrBatalCount = matched?.data
        ? matched.data.filter((p) => p.send_status !== 'terkirim' && p.send_status !== 'sent').length
        : 0;

    function submitUpload(e) {
        e.preventDefault();

        const periodeLabel = formatPeriode(uploadForm.data.periode);
        const confirmMessage = uploadForm.data.periode
            ? `Mengupload periode ${periodeLabel} akan MENGHAPUS PERMANEN semua slip gaji dari SEMUA periode sebelum ${periodeLabel}, beserta file PDF dan riwayat pengirimannya (tidak bisa dikembalikan). Lanjutkan?`
            : 'Lanjutkan upload?';

        if (!confirm(confirmMessage)) return;

        uploadForm.post(route('payslips.store'), {
            forceFormData: true,
            onSuccess: () => uploadForm.reset(),
        });
    }

    function submitMatch(e, payslipId) {
        e.preventDefault();
        matchForm.post(route('payslips.match', payslipId), {
            onSuccess: () => {
                matchForm.reset();
                setActiveUnmatchedId(null);
            },
        });
    }

    function sendOne(payslipId) {
        router.post(route('payslips.send', payslipId), {}, { preserveScroll: true });
    }

    function sendAll() {
        if (!confirm(`Kirim email ke ${pendingOrBatalCount} karyawan sekarang?`)) return;
        router.post(route('payslips.sendAll'), {}, { preserveScroll: true });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Kelola Slip Gaji
                </h2>
            }
        >
            <Head title="Kelola Slip Gaji" />

            <div className="mx-auto max-w-6xl space-y-6">
                <PageHeader
                    title="Kelola Slip Gaji"
                    subtitle="Upload PDF gabungan, review hasil pemisahan per karyawan, lalu kirim via email."
                />

                <FlashBanner />

                {/* Bagian Form Upload */}
                <div className="overflow-hidden rounded-xl border border-slate-200/80 border-l-4 border-l-[#2C5578] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-base font-bold text-[#14202B]">Upload Slip Gaji (PDF Gabungan)</h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Berkas PDF akan diproses dan dipecah otomatis per lembar berdasarkan NIK SAP karyawan.
                            </p>
                        </div>
                        <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-block">
                            Langkah 1
                        </span>
                    </div>

                    <div className="my-4 rounded-lg border border-amber-200/70 bg-[#FBF3E7] p-3.5 text-xs text-[#7A5215]">
                        <strong>Perhatian:</strong> Mengupload periode baru akan menghapus otomatis slip gaji dari periode-periode sebelumnya untuk menghemat kapasitas storage server.
                    </div>

                    <form onSubmit={submitUpload} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[220px_1fr]">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600">Periode Gaji</label>
                                <input
                                    type="month"
                                    value={uploadForm.data.periode}
                                    onChange={(e) => uploadForm.setData('periode', e.target.value)}
                                    className="w-full rounded-lg border-slate-300 py-2 text-sm focus:border-[#2C5578] focus:ring-[#2C5578]"
                                />
                                {uploadForm.errors.periode && (
                                    <p className="mt-1 text-xs text-red-600">{uploadForm.errors.periode}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600">File Dokumen PDF</label>
                                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 px-3.5 py-2 text-sm transition hover:bg-slate-50">
                                    <span className="rounded-md bg-[#2C5578] px-3 py-1 text-xs font-medium text-white shadow-sm">
                                        Pilih Berkas
                                    </span>
                                    <span className={uploadForm.data.file ? 'truncate font-medium text-[#14202B]' : 'text-slate-400'}>
                                        {uploadForm.data.file ? uploadForm.data.file.name : 'Pilih file PDF slip gaji master'}
                                    </span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => uploadForm.setData('file', e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                                {uploadForm.errors.file && (
                                    <p className="mt-1 text-xs text-red-600">{uploadForm.errors.file}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-1">
                            <button
                                type="submit"
                                disabled={uploadForm.processing || !uploadForm.data.file || !uploadForm.data.periode}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#2C5578] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1F3E59] disabled:opacity-50"
                            >
                                {uploadForm.processing ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Memproses PDF...
                                    </>
                                ) : (
                                    'Upload & Mulai Proses'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Bagian Perlu Dicocokkan Manual (Unmatched) */}
                <div className="overflow-hidden rounded-xl border border-slate-200/80 border-l-4 border-l-[#B97A1F] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-base font-bold text-[#14202B]">
                            Perlu Dicocokkan Manual
                            <StatusPill tone="amber">{unmatched?.data?.length ?? 0}</StatusPill>
                        </h3>
                    </div>

                    {(!unmatched?.data || unmatched.data.length === 0) ? (
                        <p className="mt-3 text-xs text-slate-400">
                            Semua lembar slip gaji sudah cocok dengan data karyawan. Tidak ada yang perlu dicocokkan manual.
                        </p>
                    ) : (
                        <div className="mt-4 divide-y divide-slate-100">
                            {unmatched.data.map((payslip) => (
                                <div key={payslip.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                                    <a
                                        href={route('payslips.preview', payslip.id)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm font-medium text-[#2C5578] underline underline-offset-2 hover:text-[#1F3E59]"
                                    >
                                        Lihat PDF · Periode {formatPeriode(payslip.periode)}
                                    </a>

                                    {activeUnmatchedId === payslip.id ? (
                                        <form onSubmit={(e) => submitMatch(e, payslip.id)} className="flex items-center gap-2">
                                            <select
                                                value={matchForm.data.employee_id}
                                                onChange={(e) => matchForm.setData('employee_id', e.target.value)}
                                                className="rounded-lg border-slate-300 py-1.5 text-xs focus:border-[#2C5578] focus:ring-[#2C5578]"
                                            >
                                                <option value="">Pilih karyawan tujuan...</option>
                                                {employees.map((emp) => (
                                                    <option key={emp.id} value={emp.id}>
                                                        {emp.nama} ({emp.nip})
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="submit"
                                                disabled={matchForm.processing}
                                                className="rounded-lg bg-[#2E7D52] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#215D3D] disabled:opacity-50"
                                            >
                                                Simpan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveUnmatchedId(null)}
                                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                                            >
                                                Batal
                                            </button>
                                        </form>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setActiveUnmatchedId(payslip.id)}
                                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                        >
                                            Cocokkan Karyawan
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bagian Status Pengiriman (Matched) */}
                <div className="overflow-hidden rounded-xl border border-slate-200/80 border-l-4 border-l-[#2C5578] bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
                        <div>
                            <h3 className="flex items-center gap-2 text-base font-bold text-[#14202B]">
                                Status Pengiriman
                                <StatusPill tone="green">{matched?.total ?? matched?.data?.length ?? 0} Slip</StatusPill>
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Pastikan berkas sudah sesuai sebelum menekan tombol kirim email.
                            </p>
                        </div>

                        {pendingOrBatalCount > 0 && (
                            <button
                                type="button"
                                onClick={sendAll}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2E7D52] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#215D3D]"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Kirim Semua ({pendingOrBatalCount})
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 text-sm">
                            <thead className="bg-slate-50/80">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="px-6 py-3.5 font-medium">Nama Karyawan</th>
                                    <th className="px-6 py-3.5 font-medium">NIK SAP</th>
                                    <th className="px-6 py-3.5 font-medium">Periode</th>
                                    <th className="px-6 py-3.5 font-medium">Status</th>
                                    <th className="px-6 py-3.5 text-right font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {matched?.data?.map((payslip) => (
                                    <tr key={payslip.id} className="transition hover:bg-slate-50/70">
                                        <td className="px-6 py-3.5 font-medium text-[#14202B]">
                                            {payslip.employee?.nama || '-'}
                                        </td>
                                        <td className="px-6 py-3.5 font-mono text-sm text-slate-600">
                                            {payslip.employee?.nip || '-'}
                                        </td>
                                        <td className="px-6 py-3.5 text-slate-600">
                                            {formatPeriode(payslip.periode)}
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <SendStatusPill status={payslip.send_status} />
                                        </td>
                                        <td className="px-6 py-3.5 text-right">
                                            <div className="inline-flex items-center gap-3">
                                                <a
                                                    href={route('payslips.preview', payslip.id)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs font-semibold text-[#2C5578] underline underline-offset-2 hover:text-[#1F3E59]"
                                                >
                                                    Lihat PDF
                                                </a>
                                                {payslip.send_status !== 'terkirim' && payslip.send_status !== 'sent' && (
                                                    <>
                                                        <span className="text-slate-300">|</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => sendOne(payslip.id)}
                                                            className="rounded-md bg-[#2E7D52] px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-[#215D3D]"
                                                        >
                                                            {payslip.send_status === 'batal' || payslip.send_status === 'failed' ? 'Kirim Ulang' : 'Kirim'}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {(!matched?.data || matched.data.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Belum ada berkas slip gaji yang cocok untuk periode ini. Silakan upload file PDF di atas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Navigasi Paginasi (Selalu Tampil) */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 sm:flex-row">
                        <div className="text-xs text-slate-500">
                            Menampilkan <span className="font-medium text-slate-700">{matched?.from ?? 0}</span> - <span className="font-medium text-slate-700">{matched?.to ?? 0}</span> dari{' '}
                            <span className="font-medium text-slate-700">{matched?.total ?? matched?.data?.length ?? 0}</span> slip gaji
                        </div>

                        {matched?.links && (
                            <nav className="flex flex-wrap items-center gap-1">
                                {matched.links.map((link, i) => {
                                    let label = link.label;
                                    if (label.includes('Previous')) label = '←';
                                    if (label.includes('Next')) label = '→';

                                    return (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`flex min-h-[32px] min-w-[32px] items-center justify-center rounded-md px-2.5 text-xs font-medium transition ${
                                                link.active
                                                    ? 'bg-[#2C5578] text-white shadow-sm'
                                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                            } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: label }}
                                        />
                                    );
                                })}
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}