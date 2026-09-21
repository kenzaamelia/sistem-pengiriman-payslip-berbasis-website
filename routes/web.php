<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PayslipController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Jika user sudah login, langsung alihkan ke dashboard
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Welcome', [
        'canResetPassword' => Route::has('password.request'),
        'status'           => session('status'),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/payslips', [PayslipController::class, 'index'])->name('payslips.index');
    Route::post('/payslips', [PayslipController::class, 'store'])->name('payslips.store');
    Route::post('/payslips/{payslip}/match', [PayslipController::class, 'match'])->name('payslips.match');
    Route::get('/payslips/{payslip}/preview', [PayslipController::class, 'preview'])->name('payslips.preview');
    Route::post('/payslips/{payslip}/send', [PayslipController::class, 'send'])->name('payslips.send');
    Route::post('/payslips/send-all', [PayslipController::class, 'sendAll'])->name('payslips.sendAll');

    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::post('/employees/import', [EmployeeController::class, 'import'])->name('employees.import');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');

});



require __DIR__.'/auth.php';
