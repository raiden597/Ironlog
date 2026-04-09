/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"Manrope"',    'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        lime:  '#c8ff00',
        bg:    '#080808',
        card:  '#111111',
        surface: '#161616',
        border:  '#1e1e1e',
        muted:   '#555555',
        danger:  '#ff4757',
      },
    },
  },
  plugins: [],
}
