/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f3f4f6',
        foreground: '#0f172a',
        card: '#ffffff',
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
        muted: '#e5e7eb',
        'muted-foreground': '#64748b',
        border: '#e2e8f0',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
};
