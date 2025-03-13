/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#F56920',
        'brand-dark-green': '#0A5E58',
        'brand-light-green': '#31B494',
        'brand-text': '#121212',
      },
      fontFamily: {
        'sans': ['Calibri', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 