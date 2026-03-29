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
        'text': '#111827',
      },
      fontFamily: {
        'sans': ['Lato', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'serif': ['Playfair Display', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        'display': ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
        'body': ['Lato', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}