@component('mail::message')
# Slip Gaji Anda

Halo **{{ $nama }}**,
Berikut kami lampirkan slip gaji Anda untuk periode **{{ $periode }}**. Silakan periksa lampiran PDF pada email ini.

Jika terdapat pertanyaan atau ketidaksesuaian data pada slip gaji anda, silakan hubungi bagian SDM/Keuangan PG Pesantren Baru.

Terima Kasih.

@component('mail::subcopy')
Email ini dikirim secara otomatis oleh sistem, mohon tidak membalas email ini.
@endcomponent
@endcomponent