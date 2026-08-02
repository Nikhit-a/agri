/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        crop: {
          50: '#f1f8ee',
          100: '#dcedd2',
          500: '#4d8b31',
          600: '#3d7027',
          700: '#2f5a1f'
        },
        soil: {
          500: '#8b5e34'
        }
      }
    }
  },
  plugins: []
};
