/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Birthday palette — warm, soft, premium.
        cream: {
          50: '#fdfaf3',
          100: '#faf3e8',
          200: '#f5ead8',
          300: '#ecdcc0',
        },
        peach: {
          100: '#fde4d3',
          200: '#fbd0b3',
          300: '#f5b896',
        },
        blush: {
          100: '#fce4dc',
          200: '#f7c5b8',
          300: '#eea193',
        },
        rose: {
          200: '#f3b5a4',
          300: '#e88a73',
          400: '#d76b54',
        },
        cherry: {
          300: '#e25b5b',
          400: '#c44444',
          500: '#9b2f2f',
        },
        lavender: {
          100: '#ece4f3',
          200: '#d8c8e5',
          300: '#bba4d0',
        },
        champagne: {
          100: '#f3e4c2',
          200: '#e6cf94',
          300: '#d2b46a',
          400: '#a98a3f',
        },
        espresso: {
          700: '#3a2e2a',
          800: '#2a1f1c',
          900: '#1a1311',
        },
        ink: {
          900: '#1a1311',
          800: '#2a1f1c',
          700: '#3a2e2a',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        zh: ['"Noto Serif SC"', 'Songti SC', 'serif'],
        hand: ['"Caveat"', '"Long Cang"', '"Kalam"', 'cursive'],
        'hand-zh': ['"Ma Shan Zheng"', '"Long Cang"', '"Caveat"', 'cursive'],
        // Wild cursive grass script — celebratory / climactic moments (cake wish, finale)
        'hand-brush': ['"Liu Jian Mao Cao"', '"Long Cang"', '"Ma Shan Zheng"', 'cursive'],
        // Running semi-cursive — diary / journal / personal letter feel
        'hand-run': ['"Zhi Mang Xing"', '"Long Cang"', '"Ma Shan Zheng"', 'cursive'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        cinematic: '0.42em',
        warm: '0.18em',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
        warm: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        flicker: 'flicker 2.4s ease-in-out infinite',
        'slow-sway': 'slow-sway 6s ease-in-out infinite',
        'sparkle-pop': 'sparkle-pop 4s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)', opacity: '1' },
          '20%': { transform: 'scaleY(1.08) scaleX(0.96)', opacity: '0.95' },
          '40%': { transform: 'scaleY(0.95) scaleX(1.04)', opacity: '0.9' },
          '60%': { transform: 'scaleY(1.05) scaleX(0.98)', opacity: '1' },
          '80%': { transform: 'scaleY(0.97) scaleX(1.02)', opacity: '0.92' },
        },
        'slow-sway': {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        'sparkle-pop': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};
