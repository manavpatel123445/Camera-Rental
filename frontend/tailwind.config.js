/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#181C23',      // Aurora main dark background
        'dark-card': '#23272F',    // Aurora card/sidebar background
      },
    },
  },
  plugins: [],
} 