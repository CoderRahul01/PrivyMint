/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PrivyMint Design System — Purple + Midnight Blue palette
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        midnight: {
          50:  '#f0f4ff',
          100: '#dde8ff',
          200: '#c3d4ff',
          300: '#9ab5ff',
          400: '#6a8fff',
          500: '#4565f9',
          600: '#2d44ee',
          700: '#2333db',
          800: '#1e29b2',
          900: '#1e268c',
          950: '#0f172a',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover:  'rgba(255, 255, 255, 0.10)',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 50%, #0f172a 100%)',
        'gradient-card':  'linear-gradient(145deg, rgba(139,92,246,0.15) 0%, rgba(15,23,42,0.8) 100%)',
        'gradient-hero':  'radial-gradient(ellipse at top, #4c1d95 0%, #0f172a 60%)',
        'gradient-glow':  'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.3) 0%, transparent 70%)',
      },
      fontFamily: {
        sans:  ['var(--font-outfit)', 'Inter', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in':        'fadeIn 0.5s ease-in-out',
        'slide-up':       'slideUp 0.4s ease-out',
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'glow-pulse':     'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:   { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        shimmer:   { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        float:     { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        glowPulse: { '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(139,92,246,0.6)' } },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
