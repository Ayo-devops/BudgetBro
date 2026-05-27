import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#faf7f2',
        surface: '#f0ebe1',
        card: '#ffffff',
        accent: '#007b6e',
        'accent-light': '#e6f4f2',
        alert: '#e63946',
        'alert-light': '#fdecea',
        primary: '#1a1a1a',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config