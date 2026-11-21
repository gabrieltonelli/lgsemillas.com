/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E3002C',
          crimson: '#d51936',
          darkred: '#a20513',
          rose: '#e46879',
          coral: '#ff7a4b',
          navy: '#100f26',
          slate: '#181b31',
          blue: '#0c3e72',
          deepblue: '#0b2a4a',
          gray: '#6f6f6e',
          lightgray: '#f3f3f3',
          cream: '#fbfaf7',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Archivo Narrow"', '"Inter"', 'system-ui', 'sans-serif'],
        narrow: ['"Archivo Narrow"', '"Plus Jakarta Sans"', 'sans-serif'],
        microbrew: ['"Conv_Microbrew-Soft-Four"', '"Archivo Narrow"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 14px 38px -12px rgba(16, 15, 38, 0.16)',
        card: '0 6px 24px -4px rgba(16, 15, 38, 0.08)',
        red: '0 10px 28px -8px rgba(227, 0, 44, 0.35)',
      },
    },
  },
  plugins: [],
};
