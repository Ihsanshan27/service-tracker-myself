/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        cyan: 'rgb(var(--color-cyan) / <alpha-value>)',
        mint: 'rgb(var(--color-mint) / <alpha-value>)',
        amber: 'rgb(var(--color-amber) / <alpha-value>)',
        rose: 'rgb(var(--color-rose) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        'panel-alt': 'rgb(var(--color-panel-alt) / <alpha-value>)',
        'brand-soft': 'rgb(var(--color-brand-soft) / <alpha-value>)',
        overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
      },
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 42, 0.08)',
        lift: '0 28px 70px rgba(15, 23, 42, 0.16)'
      }
    },
  },
  plugins: [],
};
