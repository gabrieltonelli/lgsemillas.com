/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lg: {
          forest: '#064e3b',
          green: '#15803d',
          leaf: '#22c55e',
          gold: '#eab308',
          amber: '#d97706',
          orange: '#ea580c',
          crimson: '#b91c1c',
          earth: '#78350f',
          soil: '#1c1917',
          sand: '#fafaf9',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 35px -10px rgba(6, 78, 59, 0.14)',
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

