const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
			colors: {
				beeColor: colors.neutral,
				beeDarkColor: colors.neutral,
			},
      gridTemplateColumns: {
        // Simple 16 column grid
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      keyframes: {
        indeterminateAnimation: {
          '0%': {
            transform: 'translateX(0) scaleX(0)',
          },
          '40%': {
            transform: 'translateX(0) scaleX(0.4)',
          },
          '100%': {
            transform: 'translateX(100%) scaleX(0.5)',
          },
        }
      },
      animation: {
        indeterminateAnimation: 'indeterminateAnimation 1s infinite linear'
      }
    },
  },
  variants: {},
  plugins: [
		require("daisyui"),
		require('@tailwindcss/typography'),
	],
	// daisyUI config (optional - here are the default values)
	daisyui: {
		themes: false, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
		darkTheme: "dark", // name of one of the included themes for dark mode
		base: true, // applies background color and foreground color for root element by default
		styled: true, // include daisyUI colors and design decisions for all components
		utils: true, // adds responsive and modifier utility classes
		rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
		prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
		logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
	},
}

