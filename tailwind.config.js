/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./Frontend/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(51, 124, 51)',
        'primary-dark': 'rgb(45, 110, 45)',
      }
    },
  },
  plugins: [],
}