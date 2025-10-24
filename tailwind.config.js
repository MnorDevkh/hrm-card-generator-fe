/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Force fallback to RGB or HEX instead of OKLCH
        primary: '#2563eb', // blue-600
        secondary: '#9333ea', // purple-600
        success: '#16a34a', // green-600
        danger: '#dc2626', // red-600
        warning: '#f59e0b', // amber-500
        gray: '#6b7280', // gray-500
      },
    },
  },
  future: {
    disableColorFunction: true,
  },
  plugins: [],
}