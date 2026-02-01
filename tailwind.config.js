/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Strict Brand Palette
                background: '#000000', // Primary Background
                surface: '#191718',    // Secondary Background / Surfaces
                border: '#363334',     // Borders & Dividers

                // Brand Accent
                primary: {
                    DEFAULT: '#EB3136',
                    hover: '#d41f24',
                    light: '#ff5c61',
                    // Numeric scale for backward compatibility
                    50: '#fff1f2',
                    100: '#ffe4e6',
                    200: '#fecdd3',
                    300: '#fda4af',
                    400: '#fb7185',
                    500: '#EB3136', // Main Brand Accent
                    600: '#d41f24', // Hover
                    700: '#be123c',
                    800: '#9f1239',
                    900: '#881337',
                },

                // Text Colors
                text: {
                    primary: '#FFFFFF',   // High contrast primary text (Assumed for dark mode)
                    secondary: '#717274', // Secondary Text / Icons
                    muted: '#96989A',     // Muted Text / Labels
                },

                // Legacy/Semantic mapping to ensure existing classes adapt
                secondary: {
                    50: '#000000',
                    100: '#0a0a0a',
                    200: '#191718', // Surface
                    300: '#363334', // Border
                    400: '#717274', // Secondary Text
                    500: '#96989A', // Muted Text
                    600: '#a3a3a3',
                    700: '#d4d4d4',
                    800: '#e5e5e5',
                    900: '#ffffff', // Inverse scale for dark mode mapping if used dynamically
                },

                // Status colors
                success: '#10b981',
                danger: '#EB3136',  // Use brand accent for danger too, or standard red? Keeping accent consistent.
                warning: '#f59e0b',
                info: '#3b82f6',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)', // Darker, deeper shadows
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
                'glow': '0 0 20px rgba(235, 49, 54, 0.3)', // Red/Accent glow
                'elevation': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #EB3136 0%, #d41f24 100%)', // Red gradient
                'gradient-dark': 'linear-gradient(to bottom, #191718, #000000)', // Subtle surface gradient
                'gradient-glow': 'radial-gradient(circle at center, rgba(235, 49, 54, 0.15) 0%, transparent 70%)',
            },
        },
    },
    plugins: [],
}
