/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["VT323", "monospace"], // Add a pixel-style font
      },
    },
  },
  plugins: [],
};
