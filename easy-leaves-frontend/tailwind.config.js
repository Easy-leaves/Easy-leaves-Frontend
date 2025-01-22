
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'border-yellow-600',
    'border-yellow-700',
    'border-blue-600',
    'border-green-700',
    'border-red-600',
    'border-neutral-600',
    'border-blue-500',
    'text-white',
  ],
  plugins: [],
}