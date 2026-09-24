/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        // Warm Humanist canvas palette
        canvas: {
          base:   '#FAFAF7',
          card:   '#FFFFFF',
          hover:  '#F5F3EE',
          subtle: '#EDE9E1',
        },
      },
      boxShadow: {
        'glass':         '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
        'card':          '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-hover':    '0 4px 16px 0 rgba(0,0,0,0.09), 0 2px 4px -1px rgba(0,0,0,0.05)',
        'glow-emerald':  '0 0 25px -5px rgba(16, 185, 129, 0.20)',
        'glow-blue':     '0 0 25px -5px rgba(59, 130, 246, 0.20)',
      },
      animation: {
        'fade-in':    'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up':   'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulseGlow 2s infinite',
        'shimmer':    'shimmer 1.8s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
