export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float\': \'float 6s ease-in-out infinite',
        'pulse-slow\': \'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rain\': \'rain 1s linear infinite',
        'spin-slow\': \'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%\': { transform: \'translateY(0)' },
          '50%\': { transform: \'translateY(-20px)' },
        },
        rain: {
          '0%\': { transform: \'translateY(-100%)', opacity: '0' },
          '10%\': { opacity: \'1' },
          '90%\': { opacity: \'1' },
          '100%\': { transform: \'translateY(100vh)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}