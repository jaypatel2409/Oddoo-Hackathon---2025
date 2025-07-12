/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepPurple: '#2D0636',
        royalPurple: '#7B1FA2',
        mediumPurple: '#B23AC7',
        lightLavender: '#E1BEE7',
      },
    },
  },
  plugins: [],
}