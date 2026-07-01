import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xsm: '300px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        // Surface tokens (driven by CSS vars in index.css so the theme is
        // centralized and could later support a light mode).
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-strong': 'rgb(var(--ink-strong) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        // Accent scale — restrained cool blue, used sparingly (Notion/Linear style).
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(59 130 246 / 0.30), 0 8px 30px -8px rgb(59 130 246 / 0.35)',
        card: '0 1px 0 0 rgb(255 255 255 / 0.03) inset, 0 8px 24px -12px rgb(0 0 0 / 0.6)',
      },
      backgroundImage: {
        // Flat solid accent (no visible gradient) — used by logo + avatars.
        'brand-gradient': 'linear-gradient(#3b82f6, #3b82f6)',
        // Very faint cool glow behind the app; keeps the dark bg from feeling flat.
        'brand-radial':
          'radial-gradient(1100px 480px at 12% -10%, rgb(59 130 246 / 0.08), transparent 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease both',
      },
    },
  },
  plugins: [tailwindScrollbar({ nocompatible: true })],
};
