/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18212F',
        muted: '#697586',
        line: '#DDE4EE',
        brand: '#2563EB',
        cyan: '#0891B2',
        mint: '#10B981',
        amber: '#F59E0B',
        rose: '#E11D48',
        surface: '#F7FAFC'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(23, 32, 51, 0.08)',
        lift: '0 18px 45px rgba(24, 33, 47, 0.12)'
      }
    },
  },
  plugins: [],
};
