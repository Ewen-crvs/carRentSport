/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './App.{js,jsx,ts,tsx}',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                // Backgrounds
                bg: '#F5F5F7',
                surface: '#FFFFFF',
                'surface-hover': '#F0F0F2',
                'surface-active': '#E8E8EC',
                'surface-dark': '#1C1C1E',
                'surface-dark-alt': '#2C2C2E',

                // Car image backgrounds
                'car-bg': '#F2D9D5',
                'car-bg-alt': '#E8E0DE',

                // Borders
                'border-app': '#E5E5EA',
                'border-light': '#F0F0F2',
                'border-dark': '#3A3A3C',

                // Text
                'text-primary': '#1C1C1E',
                'text-secondary': '#636366',
                'text-muted': '#8E8E93',
                'text-on-dark': '#FFFFFF',
                'text-on-dark-muted': '#AEAEB2',

                // Accent
                accent: '#1C1C1E',
                'accent-light': '#FFFFFF',

                // Semantic
                success: '#34C759',
                error: '#FF3B30',
                warning: '#FF9500',
                info: '#007AFF',
            },
            borderRadius: {
                'app-sm': '10px',
                'app-md': '14px',
                'app-lg': '18px',
                'app-xl': '24px',
            },
            fontSize: {
                'app-xs': '11px',
                'app-sm': '13px',
                'app-md': '15px',
                'app-lg': '17px',
                'app-xl': '20px',
                'app-2xl': '24px',
                'app-3xl': '32px',
                'app-display': '40px',
            },
        },
    },
    plugins: [],
};
