/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      spacing: {
        69: '17.25rem', // 65の値を追加（65 * 0.25 = 16.25rem）
      },
      colors: {
        custom: '#2EA9DF', // カスタムカラーを追加
        'off-white': '#fefefe', // より白に近い色
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
  darkMode: 'class', // または 'media'
};
