/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // If using the new app directory
  ],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
      }
    },
  },
  variants: {
    extend: {
      scale: ['active', 'group-hover'],
      transform: ['hover', 'focus'],
    }
  },
  plugins: [],
}