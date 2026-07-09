/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      colors: {
        'mystic-dark': '#0d0221',
        'mystic-purple': '#1a0533',
        'mystic-violet': '#2d1b69',
        'mystic-indigo': '#3d2b8a',
        'gold': '#c9a84c',
        'gold-light': '#e8c96a',
        'gold-dark': '#a07830',
        'star-white': '#f0e6ff',
        'mist': '#8b7aa8',
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'raleway': ['Raleway', 'sans-serif'],
      },
      backgroundImage: {
        'mystic-gradient': 'linear-gradient(135deg, #0d0221 0%, #1a0533 50%, #0d0221 100%)',
        'gold-gradient': 'linear-gradient(135deg, #c9a84c 0%, #e8c96a 50%, #a07830 100%)',
        'card-gradient': 'linear-gradient(180deg, #2d1b69 0%, #1a0533 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'card-flip': 'cardFlip 0.6s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(201, 168, 76, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(201, 168, 76, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'gold': '0 0 20px rgba(201, 168, 76, 0.4)',
        'gold-lg': '0 0 40px rgba(201, 168, 76, 0.6)',
        'mystic': '0 0 30px rgba(45, 27, 105, 0.8)',
      },
    },
  },
  plugins: [],
};
