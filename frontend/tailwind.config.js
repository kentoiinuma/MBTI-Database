/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      spacing: {
        69: '17.25rem',
      },
      colors: {
        custom: '#2EA9DF',
        'off-white': '#fefefe',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
  darkMode: 'class',
};
