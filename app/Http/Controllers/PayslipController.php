<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessPayslipUpload;
use App\Jobs\SendPayslipEmail;
use App\Models\Employee;
use App\Models\Payslip;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PayslipController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Payslips/Index', [
            'unmatched' => Payslip::where('matching_status', 'unmatched')
                ->latest()
                ->paginate(20, ['*'], 'unmatched_page')
                ->withQueryString(),

            // Pagination untuk tabel Status Pengiriman (matched)
            'matched' => Payslip::with(['employee', 'sends'])
                ->where('matching_status', 'matched')
                ->latest()
                ->paginate(25, ['*'], 'matched_page')
                ->withQueryString(),

            'employees' => Employee::orderBy('nama')->get(['id', 'nip', 'nama']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:pdf', 'max:51200'],
            'periode' => ['required', 'date_format:Y-m'],
        ]);

        $oldPayslips = Payslip::where('periode', '<', $validated['periode'])->get();

        foreach ($oldPayslips as $old) {
            Storage::delete($old->file_path);
        }

        $deletedCount = $oldPayslips->count();
        $deletedPeriodes = $oldPayslips->pluck('periode')->unique()->sort()->values();

        Payslip::where('periode', '<', $validated['periode'])->delete();

        $path = $request->file('file')->store('payslip-uploads');

        ProcessPayslipUpload::dispatch(
            uploadedFilePath: $path,
            periode: $validated['periode'],
            uploadedBy: $request->user()->id,
        );

        $message = 'File berhasil diupload dan sedang diproses di background.';

        if ($deletedCount > 0) {
            $periodeList = $deletedPeriodes->implode(', ');
            $message .= " Sekaligus menghapus permanen {$deletedCount} slip gaji dari periode: {$periodeList}.";
        }

        return back()->with('success', $message);
    }

    public function match(Request $request, Payslip $payslip): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
        ]);

        $payslip->update([
            'employee_id' => $validated['employee_id'],
            'matching_status' => 'matched',
        ]);

        return back()->with('success', 'Payslip berhasil dicocokkan, statusnya sekarang pending menunggu dikirim.');
    }

    public function send(Payslip $payslip): RedirectResponse
    {
        if ($payslip->matching_status !== 'matched') {
            return back()->with('warning', 'Payslip ini belum dicocokkan ke karyawan manapun.');
        }

        SendPayslipEmail::dispatch($payslip->id);

        return back()->with('success', 'Email sedang dikirim.');
    }

    public function sendAll(): RedirectResponse
    {
        $readyIds = Payslip::where('matching_status', 'matched')
            ->whereDoesntHave('sends', fn ($q) => $q->where('status', 'terkirim'))
            ->pluck('id');

        foreach ($readyIds as $id) {
            SendPayslipEmail::dispatch($id);
        }

        return back()->with('success', "{$readyIds->count()} email sedang dikirim ke antrian.");
    }

    public function preview(Payslip $payslip)
    {
        return Storage::response($payslip->file_path);
    }
}