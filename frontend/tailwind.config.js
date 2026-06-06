/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,迎えs,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Controlled by HTML tag class mutations
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f8f5',
          100: '#e1f0e8',
          500: '#0f766e', // Deep Teal / Forest Green base accent
          600: '#0d9488',
          900: '#115e59',
          950: '#042f2e',
        },
      },
      scale: {
        102: '1.02',
      }
    },
  },
  plugins: [],
};