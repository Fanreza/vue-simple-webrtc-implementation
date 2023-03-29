/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00D06C',
        'light-text-color': '#F9F9F9',
        'dark-text-color': '#212121',
        'dark-background-color': '#121317',
        'light-background-color': '#FFFFFF',
        'dark-inactive-border-color': 'rgba(33, 33, 33, 0.5)',
        'dark-active-border-color': 'rgba(33, 33, 33, 1)'
      }
    }
  },
  plugins: []
}
