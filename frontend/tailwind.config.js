/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wacdo-red': '#dc2626',
        'wacdo-yellow': '#fbbf24',
      }
    },
  },
  plugins: [],
}