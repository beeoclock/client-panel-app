const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      ...colors,
      beecolor: colors.neutral,
    },
    extend: {

    },
  },
  variants: {},
  plugins: [
  ],
}

