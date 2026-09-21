<?php

namespace App\Http\Controllers;

use App\Imports\EmployeesImport;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 25); // Default 25 agar pas untuk 700 data

        // Batasi per_page agar aman
        if (!in_array($perPage, [10, 25, 50, 100])) {
            $perPage = 25;
        }

        $employees = Employee::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nip', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('nama')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters'   => [
                'search'   => $search ?? '',
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nip'   => ['required', 'string', 'unique:employees,nip'],
            'nama'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:employees,email'],
        ]);

        Employee::create($validated);

        return back()->with('success', 'Karyawan berhasil ditambahkan.');
    }

    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'nip'   => ['required', 'string', Rule::unique('employees', 'nip')->ignore($employee->id)],
            'nama'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('employees', 'email')->ignore($employee->id)],
        ]);

        $employee->update($validated);

        return back()->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv'],
        ]);

        $import = new EmployeesImport();
        Excel::import($import, $request->file('file'));

        if ($import->failures()->isNotEmpty()) {
            $errorCount = $import->failures()->count();
            return back()->with('warning', "Import selesai, tapi {$errorCount} baris gagal diproses (duplikasi atau data tidak valid).");
        }

        return back()->with('success', 'Data karyawan berhasil diimport.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $employee->delete();

        return back()->with('success', 'Karyawan berhasil dihapus.');
    }
}