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
      },
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // Standard Blue
          dark: '#2563eb',
        },
        warning: {
          DEFAULT: '#f59e0b', // Standard Amber
        },
        danger: {
          DEFAULT: '#ef4444', // Standard Red
        },
        accent: {
          DEFAULT: '#8b5cf6', // Standard Violet
        }
      }
    },
  },
  plugins: [],
}
