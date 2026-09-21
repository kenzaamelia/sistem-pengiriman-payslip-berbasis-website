<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Jalankan seeder ini untuk membuat satu akun admin.
     * Ganti email dan password di bawah sebelum dijalankan,
     * atau jalankan lagi nanti untuk tambah admin lain.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'sdmpgpesantrenbaru@gmail.com'],
            [
                'name' => 'Sdm',
                'password' => Hash::make('sdmpg1001'),
                'email_verified_at' => now(),
            ]
        );
    }
}