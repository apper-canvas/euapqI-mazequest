/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1', // Indigo
          light: '#a5b4fc',
          dark: '#4338ca'
        },
        secondary: {
          DEFAULT: '#ec4899', // Pink
          light: '#f9a8d4',
          dark: '#be185d'
        },
        accent: '#fbbf24', // Amber
        maze: {
          wall: '#334155',
          path: '#f8fafc',
          start: '#22c55e',
          end: '#ef4444',
          collectible: '#fbbf24'
        },
        surface: {
          50: '#f8fafc',   // Lightest
          100: '#f1f5f9',
          200: '#e2e8f0', 
          300: '#cbd5e1',
          400: '#94a3b8',  
          500: '#64748b',  
          600: '#475569',  
          700: '#334155',  
          800: '#1e293b',  
          900: '#0f172a'   // Darkest
        }
      },
      fontFamily: {
        sans: ['Fredoka', 'ui-sans-serif', 'system-ui'],
        heading: ['Fredoka', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        'bubble': '1.5rem 1.5rem 1.5rem 0.25rem'
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}