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
        elara: {
          // Light theme tokens
          'bg-light': '#FFF9F7',
          'bg-light-sec': '#F7E9E7',
          'accent-light': '#D9A6A5',
          'champagne-light': '#E8D5B7',
          'text-dark': '#49383B',
          'text-muted': '#8C7375',
          'border-light': '#EBDDD9',
          'card-light': '#FFFFFF',

          // Dark theme tokens
          'bg-dark': '#191516',
          'bg-dark-sec': '#252021',
          'accent-dark': '#C99598',
          'champagne-dark': '#C8AD89',
          'text-light': '#F7EBE8',
          'text-muted-dark': '#B9A6A5',
          'border-dark': '#403435',
          'card-dark': '#302729',

          // Common brand shades
          rosewater: '#D9A6A5',
          'rosewater-hover': '#C88F8E',
          'rosewater-subtle': '#FAF0EE',
          champagne: '#E8D5B7',
          'champagne-subtle': '#F8F3EA',
          blush: '#F4DEE0',
          velvet: '#49383B',
          espresso: '#352729',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(73, 56, 59, 0.05), 0 2px 6px -1px rgba(73, 56, 59, 0.03)',
        'soft-hover': '0 12px 30px -4px rgba(73, 56, 59, 0.1), 0 4px 12px -2px rgba(73, 56, 59, 0.05)',
        'dark-soft': '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
        'dark-hover': '0 12px 30px -4px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
