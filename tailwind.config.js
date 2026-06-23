/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary - Rose/Pink (breast cancer awareness)
        primary: {
          50: '#FFF0F6',
          100: '#FFE0EC',
          200: '#FFC2D9',
          300: '#FF94BA',
          400: '#FF5C95',
          500: '#D63384',
          600: '#B5246E',
          700: '#8C1A55',
          800: '#6B133F',
          900: '#4A0D2C',
        },
        // Risk levels
        risk: {
          low: '#16A34A',
          moderate: '#D97706',
          high: '#DC2626',
        },
        // Accents
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          teal: '#14B8A6',
          gold: '#E0A458',
        },
        // Semantic, theme-aware tokens (driven by CSS variables -> dark mode)
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Noto Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        petal: '0 4px 24px rgba(214,51,132,0.08)',
        'petal-lg': '0 12px 40px rgba(214,51,132,0.14)',
        'petal-xl': '0 24px 60px rgba(214,51,132,0.20)',
        glow: '0 0 0 4px rgba(214,51,132,0.10)',
      },
      backgroundImage: {
        'rose-gradient': 'linear-gradient(135deg, #D63384 0%, #FF5C95 50%, #FF94BA 100%)',
        'rose-soft': 'linear-gradient(135deg, #FFF0F6 0%, #FFE0EC 100%)',
      },
      keyframes: {
        'ribbon-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(-8deg)' },
          '50%': { transform: 'translateY(-12px) rotate(8deg)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%': { transform: 'translateY(-6px)', opacity: '1' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '70%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'pulse-dot': {
          '0%': { transform: 'scale(1)', opacity: '0.9' },
          '70%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'ribbon-float': 'ribbon-float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'bounce-dot': 'bounce-dot 1.4s infinite ease-in-out',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4,0,0.2,1) infinite',
        'pulse-dot': 'pulse-dot 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
      },
    },
  },
  plugins: [],
};
