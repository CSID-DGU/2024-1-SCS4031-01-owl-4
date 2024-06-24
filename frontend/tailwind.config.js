/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      customForms: theme => ({
        'no-arrows': {
          '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: '0',
          },
          '&': {
            '-moz-appearance': 'textfield',
          },
        },
      }),
    },
  },
  plugins: [],
}

