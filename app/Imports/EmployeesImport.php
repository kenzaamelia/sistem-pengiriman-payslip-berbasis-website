<?php

namespace App\Imports;

use App\Models\Employee;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class EmployeesImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    /**
     * WithHeadingRow otomatis pakai baris pertama file sebagai nama kolom.
     * Jadi file Excel/CSV yang diupload admin harus punya header persis:
     * nip | nama | email
     */
    public function model(array $row)
    {
        // updateOrCreate: kalau NIP sudah ada, data di-update (bukan duplikat).
        // Berguna juga kalau admin mau re-import file yang sama untuk perbaikan data.
        return Employee::updateOrCreate(
            ['nip' => (string) $row['nip']],
            [
                'nama' => $row['nama'],
                'email' => $row['email'],
            ]
        );
    }

    public function rules(): array
    {
        return [
            'nip' => ['required'],
            'nama' => ['required', 'string'],
            'email' => ['required', 'email'],
        ];
    }
}