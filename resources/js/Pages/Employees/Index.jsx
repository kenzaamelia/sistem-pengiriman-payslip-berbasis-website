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
            className={`mb-6 rounded-md border-l-4 px-4 py-3 text-sm ${
                isWarning
                    ? 'border-l-[#B97A1F] bg-[#FBF3E7] text-[#7A5215]'
                    : 'border-l-[#2E7D52] bg-[#EAF4EE] text-[#215D3D]'
            }`}
        >
            {isWarning ? flash.warning : flash.success}
        </div>
    );
}

export default function Index({ employees, filters }) {
    // Form & Modal State
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const manualForm = useForm({ nip: '', nama: '', email: '' });
    const editForm = useForm({ nip: '', nama: '', email: '' });
    const importForm = useForm({ file: null });

    // Search & Pagination State
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 25);

    function handleSearch(e) {
        e.preventDefault();
        router.get(route('employees.index'), { search, per_page: perPage }, { preserveState: true, replace: true });
    }

    function resetSearch() {
        setSearch('');
        router.get(route('employees.index'), { per_page: perPage }, { preserveState: true, replace: true });
    }

    function handlePerPageChange(e) {
        const val = e.target.value;
        setPerPage(val);
        router.get(route('employees.index'), { search, per_page: val }, { preserveState: true, replace: true });
    }

    function submitManual(e) {
        e.preventDefault();
        manualForm.post(route('employees.store'), {
            onSuccess: () => {
                manualForm.reset();
                setCreateModalOpen(false);
            },
        });
    }

    function openEditModal(employee) {
        setEditingEmployee(employee);
        editForm.setData({
            nip: employee.nip,
            nama: employee.nama,
            email: employee.email,
        });
        editForm.clearErrors();
    }

    function submitEdit(e) {
        e.preventDefault();
        if (!editingEmployee) return;

        editForm.put(route('employees.update', editingEmployee.id), {
            onSuccess: () => setEditingEmployee(null),
        });
    }

    function submitImport(e) {
        e.preventDefault();
        importForm.post(route('employees.import'), {
            forceFormData: true,
            onSuccess: () => {
                importForm.reset();
                setImportModalOpen(false);
            },
        });
    }

    function destroy(employee) {
        if (!confirm(`Hapus data ${employee.nama}?`)) return;
        router.delete(route('employees.destroy', employee.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Data Karyawan
                </h2>
            }
        >
            <Head title="Data Karyawan" />

            <div className="min-h-screen bg-[#F6F8F7] py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header bar dengan tombol aksi */}
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <PageHeader
                            title="Data Karyawan"
                            subtitle={`Total ${employees.total.toLocaleString('id-ID')} karyawan terdaftar dalam sistem.`}
                        />
                        <div className="flex items-center gap-2 self-start md:self-auto">
                            <button
                                type="button"
                                onClick={() => setImportModalOpen(true)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-[#2E7D52] bg-white px-3.5 py-2 text-sm font-medium text-[#2E7D52] shadow-sm transition hover:bg-[#EAF4EE]"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Import Excel
                            </button>
                            <button
                                type="button"
                                onClick={() => setCreateModalOpen(true)}
                                className="inline-flex items-center gap-1.5 rounded-md bg-[#2C5578] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1F3E59]"
                            >
                                <span className="text-base leading-none">+</span> Tambah Karyawan
                            </button>
                        </div>
                    </div>

                    <FlashBanner />

                    {/* Card Utama: Tabel & Filter */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 border-l-4 border-l-[#2C5578] bg-white shadow-sm">
                        {/* Bar Filter & Controls */}
                        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* Input Pencarian */}
                            <form onSubmit={handleSearch} className="flex w-full max-w-md items-center gap-2">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="Cari nama, NIK SAP, atau email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-md border-slate-300 py-1.5 pl-3 pr-8 text-sm focus:border-[#2C5578] focus:ring-[#2C5578]"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={resetSearch}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="rounded-md bg-[#2C5578] px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-[#1F3E59]"
                                >
                                    Cari
                                </button>
                            </form>

                            {/* Pilihan Data Per Halaman */}
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <label htmlFor="perPageSelect">Tampilkan:</label>
                                <select
                                    id="perPageSelect"
                                    value={perPage}
                                    onChange={handlePerPageChange}
                                    className="rounded-md border-slate-300 py-1 pl-2.5 pr-7 text-xs font-medium text-slate-700 focus:border-[#2C5578] focus:ring-[#2C5578]"
                                >
                                    <option value="10">10 data</option>
                                    <option value="25">25 data</option>
                                    <option value="50">50 data</option>
                                    <option value="100">100 data</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 text-sm">
                                <thead className="bg-slate-50/80">
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        <th className="w-14 px-6 py-3 text-center">No</th>
                                        <th className="px-6 py-3">Nama Karyawan</th>
                                        <th className="px-6 py-3">NIK SAP</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {employees.data.map((employee, idx) => (
                                        <tr key={employee.id} className="transition hover:bg-slate-50/70">
                                            <td className="px-6 py-3.5 text-center text-xs text-slate-400">
                                                {(employees.from ?? 1) + idx}
                                            </td>
                                            <td className="px-6 py-3.5 font-medium text-[#14202B]">
                                                {employee.nama}
                                            </td>
                                            <td className="px-6 py-3.5 font-mono text-sm text-slate-600">
                                                {employee.nip}
                                            </td>
                                            <td className="px-6 py-3.5 text-slate-600">
                                                {employee.email}
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <div className="inline-flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(employee)}
                                                        className="text-sm font-semibold text-[#2C5578] hover:text-[#1F3E59] hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <span className="text-slate-300">|</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroy(employee)}
                                                        className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {employees.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                                {filters.search ? (
                                                    <div>
                                                        <p className="font-medium text-slate-600">Tidak ada data ditemukan</p>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Pencarian untuk "{filters.search}" tidak cocok dengan data karyawan mana pun.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    'Belum ada data karyawan.'
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Pagination yang Rapi */}
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 sm:flex-row">
                            <div className="text-xs text-slate-500">
                                Menampilkan <span className="font-medium text-slate-700">{employees.from ?? 0}</span> - <span className="font-medium text-slate-700">{employees.to ?? 0}</span> dari{' '}
                                <span className="font-medium text-slate-700">{employees.total}</span> data
                            </div>

                            {employees.links && employees.links.length > 3 && (
                                <nav className="flex flex-wrap items-center gap-1">
                                    {employees.links.map((link, i) => {
                                        // Bersihkan label &laquo; dan &raquo; menjadi teks yang rapi
                                        let label = link.label;
                                        if (label.includes('Previous')) label = '←';
                                        if (label.includes('Next')) label = '→';

                                        return (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                className={`flex min-h-[32px] min-w-[32px] items-center justify-center rounded-md px-2 text-xs font-medium transition ${
                                                    link.active
                                                        ? 'bg-[#2C5578] text-white shadow-sm'
                                                        : 'text-slate-600 hover:bg-white hover:shadow-sm'
                                                } ${!link.url ? 'pointer-events-none opacity-30' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: label }}
                                            />
                                        );
                                    })}
                                </nav>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Karyawan */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-md rounded-xl border border-slate-200 border-l-4 border-l-[#2C5578] bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#14202B]">Tambah Karyawan Baru</h3>
                            <button
                                type="button"
                                onClick={() => setCreateModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={submitManual} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">NIK SAP</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: 18006712"
                                    value={manualForm.data.nip}
                                    onChange={(e) => manualForm.setData('nip', e.target.value)}
                                    className="w-full rounded-md border-slate-300 text-sm focus:border-[#2C5578] focus:ring-[#2C5578]"
                                />
                                {manualForm.errors.nip && (
                                    <p className="mt-1 text-xs text-red-600">{manualForm.errors.nip}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">Nama Karyawan</label>
                                <input
                                    type="text"
                                    placeholder="Nama lengkap"
                                    value={manualForm.data.nama}
                                    onChange={(e) => manualForm.setData('nama', e.target.value)}
                                    className="w-full rounded-md border-slate-300 text-sm focus:border-[#2C5578] focus:ring-[#2C5578]"
                                />
                                {manualForm.errors.nama && (
                                    <p className="mt-1 text-xs text-red-600">{manualForm.errors.nama}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">Alamat Email</label>
                                <input
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={manualForm.data.email}
                                    onChange={(e) => manualForm.setData('email', e.target.value)}
                                    className="w-full rounded-md border-slate-300 text-sm focus:border-[#2C5578] focus:ring-[#2C5578]"
                                />
                                {manualForm.errors.email && (
                                    <p className="mt-1 text-xs text-red-600">{manualForm.errors.email}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(false)}
                                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={manualForm.processing}
                                    className="rounded-md bg-[#2C5578] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1F3E59] disabled:opacity-50"
                                >
                                    {manualForm.processing ? 'Menyimpan...' : 'Simpan Karyawan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit Karyawan */}
            {editingEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-md rounded-xl border border-slate-200 border-l-4 border-l-[#2C5578] bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#14202B]">Edit Data Karyawan</h3>
                            <button
                                type="button"
                                onClick={() => setEditingEmployee(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">NIK SAP</label>
                                <input
                                    type="text"
                                    value={editForm.data.nip}
                                    onChange={(e) => editForm.setData('nip', e.target.value)}
                                    className="w-full rounded-md border-slate-300 text-sm focus:border-[#2C5578] focus:ring-[#2C5578]"
                                />
                                {editForm.errors.nip && (
                                    <p className="mt-1 text-xs text-red-600">{editForm.errors.nip}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">Nama</label>
                                <input
                                    type="text"
                                    value={editForm.data.nama}
                                    onChange={(e) => editForm.setData('nama', e.target.value)}
                                    className="w-full rounded-md border-slate-300 text-sm focus:border-[#2C5578] focus:ring-[#2C5578]"
                                />
                                {editForm.errors.nama && (
                                    <p className="mt-1 text-xs text-red-600">{editForm.errors.nama}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">Email</label>
                                <input
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    className="w-full rounded-md border-slate-300 text-sm focus:border-[#2C5578] focus:ring-[#2C5578]"
                                />
                                {editForm.errors.email && (
                                    <p className="mt-1 text-xs text-red-600">{editForm.errors.email}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingEmployee(null)}
                                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="rounded-md bg-[#2C5578] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1F3E59] disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Import Excel/CSV */}
            {importModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-md rounded-xl border border-slate-200 border-l-4 border-l-[#2E7D52] bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#14202B]">Import Data Karyawan</h3>
                            <button
                                type="button"
                                onClick={() => setImportModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={submitImport} className="space-y-4">
                            <div className="rounded-lg bg-emerald-50/60 p-3 text-xs text-emerald-800">
                                Pastikan file Excel (.xlsx, .xls) atau .csv memiliki baris header pertama:
                                <div className="mt-1 font-mono font-semibold">nik sap, nama, email</div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">Pilih Berkas</label>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => importForm.setData('file', e.target.files[0])}
                                    className="w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-[#2E7D52] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#215D3D]"
                                />
                                {importForm.errors.file && (
                                    <p className="mt-1 text-xs text-red-600">{importForm.errors.file}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setImportModalOpen(false)}
                                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={importForm.processing || !importForm.data.file}
                                    className="rounded-md bg-[#2E7D52] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#215D3D] disabled:opacity-50"
                                >
                                    {importForm.processing ? 'Mengimport...' : 'Mulai Import'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}