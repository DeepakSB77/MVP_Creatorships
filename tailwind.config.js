import { themeColors } from './src/styles/theme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: themeColors,
      backgroundColor: themeColors,
      borderColor: themeColors,
      textColor: themeColors,
    },
  },
  plugins: [],
}

