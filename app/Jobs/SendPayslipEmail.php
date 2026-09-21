<?php

namespace App\Jobs;

use App\Mail\PayslipMail;
use App\Models\Payslip;
use App\Models\PayslipSend;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendPayslipEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [30, 60, 120];

    public function __construct(
        public int $payslipId,
    ) {}

    public function handle(): void
    {
        $payslip = Payslip::with('employee')->findOrFail($this->payslipId);

        if (! $payslip->employee) {
            Log::warning("SendPayslipEmail dibatalkan, payslip #{$payslip->id} belum punya employee terkait.");

            return;
        }

        // Satu payslip = satu baris status (bukan satu baris per percobaan),
        // supaya status pending/terkirim/batal selalu mencerminkan kondisi
        // TERKINI, bukan riwayat tiap retry.
        $send = PayslipSend::firstOrCreate(
            ['payslip_id' => $payslip->id],
            ['status' => 'pending']
        );

        // Exception SENGAJA tidak ditangkap di sini (tidak pakai try/catch) -
        // supaya mekanisme retry bawaan job ($tries/$backoff di atas) tetap
        // jalan normal. Status baru diubah jadi 'batal' di method failed()
        // di bawah, yaitu setelah SEMUA percobaan retry benar-benar habis.
        Mail::to($payslip->employee->email)
            ->send(new PayslipMail($payslip));

        $send->update([
            'status' => 'terkirim',
            'sent_at' => now(),
            'error_message' => null,
        ]);
    }

    /**
     * Dipanggil setelah semua percobaan ($tries) habis dan tetap gagal.
     * Ini titik yang menentukan status akhir 'batal'.
     */
    public function failed(Throwable $exception): void
    {
        PayslipSend::updateOrCreate(
            ['payslip_id' => $this->payslipId],
            [
                'status' => 'batal',
                'error_message' => $exception->getMessage(),
            ]
        );

        Log::error("Pengiriman email payslip #{$this->payslipId} gagal permanen: {$exception->getMessage()}");
    }
}