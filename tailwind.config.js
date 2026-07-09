/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./src/**/*.{html,js}", 
  ],
  theme: {
    extend: {

      colors: {
        'brand-dark': '#0b1e24',  
        'brand-light': '#fdfbf7',  
        'brand-terracotta': '#D2B49F', 
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}