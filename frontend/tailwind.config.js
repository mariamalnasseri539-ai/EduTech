/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Strict Design Palette
        gold: {
          DEFAULT: '#FFCB74',
          400: '#ffd794',
          500: '#FFCB74',
          600: '#e6b25a',
          hover: '#ffd387',
        },
        pitch: {
          DEFAULT: '#111111',
          surface: '#111111',
          darker: '#0a0a0a',
        },
        charcoal: {
          DEFAULT: '#2F2F2F',
          card: '#2F2F2F',
          light: '#3d3d3d',
          border: '#3a3a3a',
          input: '#262626',
        },
        offwhite: {
          DEFAULT: '#F6F6F6',
          surface: '#F6F6F6',
          subtle: '#eeeeee',
          border: '#e5e5e5',
        },
        purewhite: '#FFFFFF',

        // Brand & Cyber Accents
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        cyber: {
          bg: '#111111',
          card: '#2F2F2F',
          cardBorder: '#3a3a3a',
          neonBlue: '#38bdf8',
          neonPurple: '#a855f7',
          neonEmerald: '#10b981',
          neonAmber: '#FFCB74',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 4px 20px -2px rgba(255, 203, 116, 0.25)',
        'card-soft': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'card-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 4px 12px -2px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
