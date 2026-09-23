import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                // Mengganti font sans default dari 'Figtree' menjadi 'Poppins'
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            // Menaikkan ukuran font Tailwind bawaan sekitar 1–2px agar lebih jelas dan terbaca
            fontSize: {
                'xs': ['0.8125rem', { lineHeight: '1.25rem' }],   // ~13px (sebelumnya 12px)
                'sm': ['0.9375rem', { lineHeight: '1.375rem' }],  // ~15px (sebelumnya 14px)
                'base': ['1.0625rem', { lineHeight: '1.625rem' }],// ~17px (sebelumnya 16px)
                'lg': ['1.1875rem', { lineHeight: '1.75rem' }],   // ~19px (sebelumnya 18px)
                'xl': ['1.3125rem', { lineHeight: '1.875rem' }],   // ~21px (sebelumnya 20px)
                '2xl': ['1.625rem', { lineHeight: '2.125rem' }],  // ~26px (sebelumnya 24px)
                '3xl': ['2rem', { lineHeight: '2.375rem' }],      // ~32px (sebelumnya 30px)
                '4xl': ['2.5rem', { lineHeight: '2.75rem' }],     // ~40px (sebelumnya 36px)
            },
        },
    },

    plugins: [forms],
};