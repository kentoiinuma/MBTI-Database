/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        '69': '17.25rem', // 65の値を追加（65 * 0.25 = 16.25rem）
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
