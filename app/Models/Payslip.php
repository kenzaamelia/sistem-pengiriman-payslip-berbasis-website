<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payslip extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'matching_status',
        'periode',
        'file_path',
        'uploaded_by',
    ];

    /**
     * WAJIB ada supaya accessor send_status ikut ter-serialize ke JSON
     * (dan sampai ke React sebagai payslip.send_status). Tanpa ini,
     * Laravel diam-diam tidak menyertakan accessor di output JSON.
     */
    protected $appends = ['send_status'];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function sends(): HasMany
    {
        return $this->hasMany(PayslipSend::class)->latest();
    }

    public function getSendStatusAttribute(): string
    {
        return $this->sends->first()?->status ?? 'pending';
    }
}