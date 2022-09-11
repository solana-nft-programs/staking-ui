const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './features/**/*.{tsx,ts}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './common/**/*.{js,ts,jsx,tsx}',
    './rental-components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          400: '#9945ff',
        },
        teal: {
          400: '#01cf8e',
        },
      },
      fontFamily: {
        sans: ['Axiforma', ...defaultTheme.fontFamily.sans],
        serif: ['Ishimura', ...defaultTheme.fontFamily.serif],
      },
      animation: {
        'slide-in': 'slideIn 0.15s ease-in',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
