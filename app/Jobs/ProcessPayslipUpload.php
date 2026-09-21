<?php

namespace App\Jobs;

use App\Models\Employee;
use App\Models\Payslip;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser as PdfTextParser;
use setasign\Fpdi\Fpdi;

class ProcessPayslipUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $uploadedFilePath,
        public string $periode,
        public int $uploadedBy,
    ) {}

    public function handle(): void
    {
        $sourcePath = Storage::path($this->uploadedFilePath);

        $textParser = new PdfTextParser();
        $document = $textParser->parseFile($sourcePath);
        $pages = $document->getPages();

        Storage::makeDirectory('payslips/'.$this->periode);

        foreach ($pages as $index => $page) {
            $pageNumber = $index + 1;
            $pageText = $page->getText();

            $nip = $this->extractNip($pageText);
            $employee = $nip ? Employee::where('nip', $nip)->first() : null;

            $splitFilePath = $this->splitPage($sourcePath, $pageNumber);

            Payslip::create([
                'employee_id' => $employee?->id,
                'matching_status' => $employee ? 'matched' : 'unmatched',
                'periode' => $this->periode,
                'file_path' => $splitFilePath,
                'uploaded_by' => $this->uploadedBy,
            ]);

            if (! $employee) {
                Log::warning("Payslip halaman {$pageNumber} (periode {$this->periode}) tidak cocok dengan karyawan manapun. NIP terbaca: ".($nip ?? '(tidak ditemukan)'));
            }
        }

        Storage::delete($this->uploadedFilePath);
    }

    private function extractNip(string $text): ?string
    {
        if (preg_match('/NIK\s*SAP[^\d]{0,20}(\d{7,10})/i', $text, $matches)) {
            return $matches[1];
        }

        return null;
    }

    private function splitPage(string $sourcePath, int $pageNumber): string
    {
        $pdf = new Fpdi();
        $pdf->setSourceFile($sourcePath);

        $templateId = $pdf->importPage($pageNumber);
        $size = $pdf->getTemplateSize($templateId);

        $orientation = $size['width'] > $size['height'] ? 'L' : 'P';
        $pdf->AddPage($orientation, [$size['width'], $size['height']]);
        $pdf->useTemplate($templateId);

        $filename = 'payslips/'.$this->periode.'/'.uniqid('slip_').'.pdf';
        $pdf->Output(Storage::path($filename), 'F');

        return $filename;
    }
}