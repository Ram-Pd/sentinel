/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0d9488', // teal-600
          light: '#2dd4bf', // teal-400
          dark: '#0f766e', // teal-700
        },
        warning: {
          DEFAULT: '#f59e0b', // amber-500
        },
        danger: {
          DEFAULT: '#f43f5e', // rose-500
        },
        accent: {
          DEFAULT: '#8b5cf6', // violet-500
        }
      }
    },
  },
  plugins: [],
}
