module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './common/**/*.{js,ts,jsx,tsx}',
    './rental-components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundColor: '#000000',
      colors: {
        primary: '#F2A93C',
        'primary-hover': '#b77f2b',
        'primary-light': 'rgba(200, 138, 244, 0.12)',
        'primary-2': '#CE81F4',
        border: 'rgba(221, 218, 218, 0.2)',
        secondary: '#7EFFE8',
        blue: '#49DEFF',
        'blue-500': 'rgb(59 130 246)',
        accent: '#CE81F4',
        glow: '#F2A93C',
        accent: '#FFA500',
        'light-0': '#FFFFFF',
        'light-1': '#F0F1F3',
        'light-2': '#B1AFBB',
        'light-4': '#697b89',
        'medium-3': '#8D8B9B',
        'medium-4': '#6D6C7C',
        'dark-3': '#333333',
        'dark-4': '#161616',
        'dark-5': '#0B0B0B',
        'dark-6': '#000000',
        twitter: '#1DA1F2',
        blue: {
          500: '#29A6F3',
        },
        violet: {
          500: '#CE81F4',
        },
        yellow: {
          500: '#FEFF52',
        },
        green: {
          200: '#E7FE55',
          500: '#74FF8C',
        },
        purple: {
          400: '#CE81F4',
          500: '#907EFF',
        },
        teal: {
          500: '#7EFFE8',
        },
        orange: {
          500: '#F2A93C',
          900: '#3e2807',
        },
        gray: {
          400: '#B1AFBB',
          500: '#8D8B9B',
          600: '#252526',
          700: '#323232',
          800: '#161616',
          900: '#0b0b0b',
        },
        slate: {
          900: '#0c0c0d',
        },
        red: {
          800: '#4c1734',
        },
      },
      letterSpacing: {
        wider: '0.07em',
      },
      lineHeight: {
        12: '3.5rem',
      },
      leading: {
        relaxed: '1.5',
      },
      boxShadow: {
        deep: '11px 20px 19px 0px rgba(0,0,0,0.53);',
        'deep-float': '8px 20px 24px 4px rgba(0,0,0,0.4)',
        'yellow-glow': '0px 0px 80px rgba(242, 169, 60, 0.30)',
        'green-glow': '0px 0px 80px rgba(116, 255, 140, 0.2)',
        'blue-glow': '0px 0px 80px rgba(41, 166, 243, 0.3);',
        'maroon-glow': '0px 0px 80px rgba(76, 23, 52, 0.5);',
      },
    },
  },
  plugins: [],
}
