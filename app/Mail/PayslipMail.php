<?php

namespace App\Mail;

use App\Models\Payslip;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class PayslipMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Payslip $payslip,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Slip Gaji Periode '.$this->payslip->periode,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.payslip',
            with: [
                'nama' => $this->payslip->employee->nama,
                'periode' => $this->payslip->periode,
            ],
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromPath(Storage::path($this->payslip->file_path))
                ->as('slip_Gaji_'.$this->payslip->periode.'.pdf')
                ->withMime('application/pdf'),
        ];
    }
}