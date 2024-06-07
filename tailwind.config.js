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
        },
				slideIn: {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0%)' },
				},
				slideOut: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' },
				},
      },
      animation: {
        indeterminateAnimation: 'indeterminateAnimation 1s infinite linear',
				slideIn: 'slideIn 0.2s ease-out forwards',
				slideOut: 'slideOut 0.2s ease-out forwards',
      }
    },
  },
  variants: {},
  plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
	],
}

