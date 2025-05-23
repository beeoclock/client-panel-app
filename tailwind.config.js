const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		"./src/**/*.{html,ts}",
	],
	theme: {
		aspectRatio: {
			auto: 'auto',
			square: '1 / 1',
			video: '16 / 9',
			1: '1',
			2: '2',
			3: '3',
			4: '4',
			5: '5',
			6: '6',
			7: '7',
			8: '8',
			9: '9',
			10: '10',
			11: '11',
			12: '12',
			13: '13',
			14: '14',
			15: '15',
			16: '16',
		},
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
					'0%': {transform: 'translateX(100%)'},
					'100%': {transform: 'translateX(0%)'},
				},
				slideOut: {
					'0%': {transform: 'translateX(0)'},
					'100%': {transform: 'translateX(100%)'},
				},
			},
			animation: {
				indeterminateAnimation: 'indeterminateAnimation 1s infinite linear',
				slideIn: 'slideIn 0.2s ease-out forwards',
				slideOut: 'slideOut 0.2s ease-out forwards',
			}
		},
		screens: {
			'sm': '640px',
			// => @media (min-width: 640px) { ... }

			'md': '768px',
			// => @media (min-width: 768px) { ... }

			'lg': '1024px',
			// => @media (min-width: 1024px) { ... }

			'xl': '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px',
			// => @media (min-width: 1536px) { ... }

			// Mobile
			'mobile': {'max': '639px'},
			'tablet': {'min': '640px', 'max': '1023px'},
			// Mobile or laptop
			'not-tablet': [
				{'max': '639px'},
				{'min': '1024px'}
			]
		}
	},
	variants: {},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/container-queries'),
		function ({ addVariant }) {
			addVariant('max-sm', '@media (max-width: 639px)'); // Below `sm` (640px)
			addVariant('max-md', '@media (max-width: 767px)'); // Below `md` (768px)
			addVariant('max-lg', '@media (max-width: 1023px)'); // Below `lg` (1024px)
			addVariant('max-xl', '@media (max-width: 1279px)'); // Below `xl` (1280px)
		},
	],
}

