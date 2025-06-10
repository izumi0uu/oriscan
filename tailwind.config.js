/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      flex: {
        2: '2 2 0%',
        4: '4 4 0%',
        5: '5 5 0%',
        6: '6 6 0%',
      },
      keyframes: {
        spinnerbulqg: {
          '0%': {
            'clip-path': 'polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)',
          },
          '12.5%': {
            'clip-path': 'polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%)',
          },
          '25%': {
            'clip-path': 'polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%)',
          },
          '50%': {
            'clip-path': 'polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)',
          },
          ' 62.5%': {
            'clip-path': 'polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)',
          },

          '75%': {
            'clip-path': 'polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%)',
          },
          '100%': {
            'clip-path': 'polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%)',
          },
        },
        spinneroaa3wk: {
          '0%': {
            transform: 'scaleY(1) rotate(0deg)',
          },
          '49.99%': {
            transform: 'scaleY(1) rotate(135deg)',
          },
          '50%': {
            transform: 'scaleY(-1) rotate(0deg)',
          },
          '100%': {
            transform: 'scaleY(-1) rotate(-135deg)',
          },
        },
      },
      screens: {
        '3xl': '1792px',
        '4xl': '2048px',
      },
      colors: {
        orange: '#FF5500',
        peach: '#FFC3A6',
        mint: '#C2EBC4',
        sky: '#B3D9FF',
        pink: '#FF9ECF',
        gold: '#BC812E',
        black: '#0D0C0C', // todo: really? everywhere?
        neutral: {
          0: '#F2F0ED',
          50: '#EBE8E5',
          100: '#E4E0DC',
          200: '#CFC9C2',
          300: '#8C877D',
          400: '#595650',
          500: '#383432',
          600: '#2A2726',
          700: '#1E1C1B',
          800: '#181717',
          900: '#141312',
        },
        primary: '#F5D802',
      },
      animation: {
        spinnerBulqg: `spinnerbulqg 1.1199999999999999s infinite linear alternate,
        spinneroaa3wk 2.2399999999999998s infinite linear`,
      },
      boxShadow: {
        navItemShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
}
