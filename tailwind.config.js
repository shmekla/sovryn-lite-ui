module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    options: {
      keyframes: true,
    },
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      cursor: ['disabled'],
      animation: {
        'reverse-spin': 'reverse-spin 1s linear infinite',
        'ping-once': 'ping 1s cubic-bezier(0, 0, 0.2, 1) normal',
      },
      keyframes: {
        'reverse-spin': {
          from: {
            transform: 'rotate(360deg)',
          },
        },
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      animation: ['motion-safe'],
    },
  },
  plugins: [],
};
