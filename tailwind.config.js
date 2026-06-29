/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        maroon: {
          50: '#fdf2f2',
          100: '#fde3e3',
          200: '#fccccc',
          300: '#f9a8a8',
          400: '#f47272',
          500: '#ef4444',
          600: '#7c1d1d',
          700: '#5c1414',
          800: '#3d0e0e',
          900: '#1f0707',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4a017',
          600: '#b8860b',
          700: '#8b6914',
          800: '#6b4f14',
          900: '#4d3712',
        },
        ethnic: {
          bg: '#fdf6f0',
          card: '#ffffff',
          text: '#2d1b0e',
          muted: '#7c6e5e',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
