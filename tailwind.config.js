/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm:   ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      backgroundOpacity: {
        2: '0.02',
        4: '0.04',
        6: '0.06',
        8: '0.08',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 3s linear infinite',
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(249,115,22,0.30)',
        'glow-md': '0 0 24px rgba(249,115,22,0.40)',
        'glow-lg': '0 0 48px rgba(249,115,22,0.20)',
      },
    },
  },
  plugins: [],
};