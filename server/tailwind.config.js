/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    // Ensure all relevant source files are included for Tailwind to scan
    "./src/**/*.{js,jsx,ts,tsx}",
    // If you have components in a specific 'components' folder, this already covers it if inside src
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["VT323", "monospace"], // Custom font for Tailwind
      },
      // You can define custom colors, spacing, etc. here for consistent branding
      // colors: {
      //   'primary-brand': '#ff4081',
      //   'dark-bg': '#111',
      // },
      // spacing: {
      //   'base-padding': '1rem',
      // },
    },
  },
  plugins: [
    // Add any desired Tailwind plugins here, e.g.,
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};