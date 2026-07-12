/** @type {import('tailwindcss').Config} */

/* Every value below resolves to a CSS variable defined in src/styles/tokens.css.
   That file is the source of truth; this one only exposes it to Tailwind.
   Colours are RGB triplets so `<alpha-value>` (e.g. bg-primary-500/20) works. */
const rgb = (v) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Brand scale. `primary` is the historical name and stays — `brand` is
           the same scale under the name the bible uses. Both are supported. */
        primary: {
          50: rgb('--brand-50'),
          100: rgb('--brand-100'),
          200: rgb('--brand-200'),
          300: rgb('--brand-300'),
          400: rgb('--brand-400'),
          500: rgb('--brand-500'),
          600: rgb('--brand-600'),
          700: rgb('--brand-700'),
          800: rgb('--brand-800'),
          900: rgb('--brand-900'),
          950: rgb('--brand-950'),
        },
        brand: {
          50: rgb('--brand-50'),
          100: rgb('--brand-100'),
          200: rgb('--brand-200'),
          300: rgb('--brand-300'),
          400: rgb('--brand-400'),
          500: rgb('--brand-500'),
          600: rgb('--brand-600'),
          700: rgb('--brand-700'),
          800: rgb('--brand-800'),
          900: rgb('--brand-900'),
          950: rgb('--brand-950'),
          DEFAULT: rgb('--accent'),
          hover: rgb('--accent-hover'),
          /* text-brand-text = the only brand colour safe for body text */
          text: rgb('--accent-text'),
          soft: rgb('--accent-soft'),
        },

        /* Warm neutral base */
        sand: {
          50: rgb('--sand-50'),
          100: rgb('--sand-100'),
          200: rgb('--sand-200'),
          300: rgb('--sand-300'),
          400: rgb('--sand-400'),
          500: rgb('--sand-500'),
          600: rgb('--sand-600'),
          700: rgb('--sand-700'),
          800: rgb('--sand-800'),
          900: rgb('--sand-900'),
        },

        /* Semantic surfaces + text (theme-aware) */
        canvas: rgb('--canvas'),
        card: rgb('--card'),
        elevated: rgb('--elevated'),
        sunken: rgb('--sunken'),
        line: rgb('--line'),
        'line-strong': rgb('--line-strong'),
        ink: rgb('--ink'),
        muted: rgb('--muted'),
        faint: rgb('--faint'),
        'on-brand': rgb('--on-brand'),

        /* Semantic states — each has a fill, an AA-safe text tone, and a soft bg */
        calm: {
          DEFAULT: rgb('--calm'),
          text: rgb('--calm-text'),
          soft: rgb('--calm-soft'),
        },
        warn: {
          DEFAULT: rgb('--warn'),
          text: rgb('--warn-text'),
          soft: rgb('--warn-soft'),
        },
        attention: {
          DEFAULT: rgb('--attention'),
          text: rgb('--attention-text'),
          soft: rgb('--attention-soft'),
        },
        info: {
          DEFAULT: rgb('--info'),
          text: rgb('--info-text'),
          soft: rgb('--info-soft'),
        },
        gold: {
          DEFAULT: rgb('--gold'),
          text: rgb('--gold-text'),
          soft: rgb('--gold-soft'),
        },

        /* Risk bands — awareness only, never a diagnosis (HARD RULE 1) */
        risk: {
          low: rgb('--risk-low'),
          'low-text': rgb('--risk-low-text'),
          moderate: rgb('--risk-moderate'),
          'moderate-text': rgb('--risk-moderate-text'),
          high: rgb('--risk-high'),
          'high-text': rgb('--risk-high-text'),
        },

        /* The brand as an interactive accent. `accent-text` is the ONLY brand
           tone legal for body text; `accent` (the fill) is 4.2:1 on canvas.
           blue/purple/teal/gold are the legacy names — existing pages use them. */
        accent: {
          DEFAULT: rgb('--accent'),
          hover: rgb('--accent-hover'),
          text: rgb('--accent-text'),
          soft: rgb('--accent-soft'),
          blue: rgb('--info'),
          purple: '#8B5CF6',
          teal: rgb('--calm'),
          gold: rgb('--gold'),
        },
      },

      fontFamily: {
        arabic: ['IBM Plex Sans Arabic', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Noto Sans', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      /* Named type steps. Tailwind's numeric scale (text-lg…) still works;
         these are the semantic hierarchy the bible refers to. */
      fontSize: {
        display: ['var(--text-display)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        h1: ['var(--text-h1)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        h2: ['var(--text-h2)', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '800' }],
        h3: ['var(--text-h3)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        h4: ['var(--text-h4)', { lineHeight: '1.4', fontWeight: '700' }],
        'body-lg': ['var(--text-body-lg)', { lineHeight: '1.75' }],
        body: ['var(--text-body)', { lineHeight: '1.7' }],
        'body-sm': ['var(--text-body-sm)', { lineHeight: '1.6' }],
        caption: ['var(--text-caption)', { lineHeight: '1.5' }],
        overline: ['var(--text-overline)', { lineHeight: '1.4', letterSpacing: '0.12em', fontWeight: '800' }],
      },

      spacing: {
        gutter: 'var(--gutter)',
        section: 'var(--section-y)',
      },

      maxWidth: {
        content: '72rem',
        prose: '68ch',
      },

      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        '4xl': '2rem',
        '5xl': '2.5rem',
        pill: 'var(--radius-pill)',
      },

      boxShadow: {
        /* Historical "petal" names — pink-tinted, never neutral grey. */
        petal: 'var(--shadow-2)',
        'petal-lg': 'var(--shadow-3)',
        'petal-xl': 'var(--shadow-4)',
        glow: 'var(--ring-brand)',
        /* Semantic elevation ladder. */
        e1: 'var(--shadow-1)',
        e2: 'var(--shadow-2)',
        e3: 'var(--shadow-3)',
        e4: 'var(--shadow-4)',
        overlay: 'var(--shadow-5)',
        'glow-brand': 'var(--glow-brand)',
        'glow-calm': 'var(--glow-calm)',
      },

      backgroundImage: {
        /* Decorative only — its light end fails contrast with white text. */
        'rose-gradient': 'var(--gradient-brand)',
        'brand-gradient': 'var(--gradient-brand)',
        /* AA-safe with white text. This is what CTAs should use. */
        'brand-cta': 'var(--gradient-cta)',
        'rose-soft': 'var(--gradient-soft)',
        'brand-soft': 'var(--gradient-soft)',
        berry: 'var(--gradient-berry)',
        aurora: 'var(--gradient-aurora)',
      },

      transitionTimingFunction: {
        soft: 'var(--ease-soft)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
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
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'ribbon-float': 'ribbon-float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'bounce-dot': 'bounce-dot 1.4s infinite ease-in-out',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4,0,0.2,1) infinite',
        'pulse-dot': 'pulse-dot 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        'rise-in': 'rise-in var(--duration-slow) var(--ease-soft) both',
      },
    },
  },
  plugins: [],
};
