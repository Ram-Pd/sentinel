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
        display: ['Inter', 'sans-serif'], // SpaceX uses clean sans-serif for everything
        mono: ['monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#ffffff', // Pure White for primary accents
          light: '#f8f8f8',
          dark: '#e0e0e0',
        },
        warning: {
          DEFAULT: '#f59e0b', 
        },
        danger: {
          DEFAULT: '#ef4444', 
        },
        accent: {
          DEFAULT: '#a3a3a3', // subtle grey
        },
        slate: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#000000',
        }
      },
      boxShadow: {
        // SpaceX does not use glows, mostly flat
        'glow-primary': 'none',
        'glow-danger': 'none',
      },
      letterSpacing: {
        'widest': '.25em',
      }
    },
  },
  plugins: [],
}
