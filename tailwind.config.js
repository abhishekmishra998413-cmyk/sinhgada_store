/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sinhgad: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316', // Orange pride
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#1e3a8a', // Sinhgad blue/navy
          950: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
