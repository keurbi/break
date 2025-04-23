// tailwind.config.js
module.exports = {
	content: [
	  './src/pages/**/*.{js,ts,jsx,tsx}',
	  './src/components/**/*.{js,ts,jsx,tsx}',
	  './src/app/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
	  extend: {
		colors: {
		  primary: '#7346FF',
		  secondary: '#CFAAFF',
		  tertiary: '#D5DDF4',
		  grayCustom: '#656565',
		},
	  },
	},
	plugins: ["@tailwindcss/postcss"],
  };
  