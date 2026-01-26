/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'portal-bg': '#ffffff',
        'portal-primary': '#287460',
        'portal-dark': '#1f4d42',
        'footer-bg': '#5A8A7F',
        'text': '#111827',
      },
      fontFamily: {
        'sans': ['Lato', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'serif': ['Playfair Display', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        'display': ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
        'body': ['Lato', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'header': 'var(--portal-header-height, 80px)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-tablet': 'marquee 26s linear infinite',
        'marquee-mobile': 'marquee 22s linear infinite',
        'marquee-sm': 'marquee 20s linear infinite',
        'marquee-xs': 'marquee 18s linear infinite',
      },
      screens: {
        'xs': '640px',
      },
    },
  },
  plugins: [],
}