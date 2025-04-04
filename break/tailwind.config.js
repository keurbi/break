// break/tailwind.config.js
module.exports = {
	content: [
	  './src/pages/**/*.{js,ts,jsx,tsx}',
	  './src/components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
	  extend: {
		colors: {
		  "primary-color": "var(--primary-color)",
		  "secondary-color": "var(--secondary-color)",
		  "tertiary-color": "var(--tertiary-color)",
		  "gray-custom": "var(--gray-custom)",
		},
	  },
	},
	plugins: [],
  };
  