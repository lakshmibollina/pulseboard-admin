/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(16 24 40 / 0.04), 0 4px 16px -4px rgb(16 24 40 / 0.08)',
        'card-hover': '0 2px 4px rgb(16 24 40 / 0.06), 0 12px 28px -8px rgb(16 24 40 / 0.14)',
      },
    },
  },
  plugins: [],
}
