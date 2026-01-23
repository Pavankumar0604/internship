/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand Colors from "Mind Mesh" UI
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9', // Sky Blue (Action buttons)
                    600: '#0284c7', // Darker blue for hover
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                secondary: {
                    50: '#f8fafc', // Light gray backgrounds
                    100: '#f1f5f9',
                    200: '#e2e8f0', // Borders
                    300: '#cbd5e1',
                    400: '#94a3b8', // Icons inactive
                    500: '#64748b', // Secondary text
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b', // Main text
                    900: '#0f172a',
                },
                // Status colors from dashboard
                success: '#10b981', // Green (Verified)
                danger: '#ef4444',  // Red (Rejected)
                background: '#f8fafc', // Main app background
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', // Clean card shadow
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
                'glow': '0 0 20px rgba(14, 165, 233, 0.3)', // Blue glow
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)', // Blue gradient
                'gradient-badge': 'linear-gradient(to right, #0ea5e9, #38bdf8)',
            }
        },
    },
    plugins: [],
}
