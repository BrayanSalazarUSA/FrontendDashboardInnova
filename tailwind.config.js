/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        14: '14px',
      },
      backgroundColor: {
        'main-bg': '#FAFBFB',
        'main-dark-bg': '#20232A',
        'secondary-dark-bg': '#33373E',
        'light-gray': '#F7F7F7',
        'half-transparent': 'rgba(0, 0, 0, 0.5)',
      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      width: {
        400: '400px',
        760: '760px',
        780: '780px',
        800: '800px',
        1000: '1000px',
        1200: '1200px',
        1400: '1400px',
      },
      height: {
        80: '80px',
      },
      minHeight: {
        590: '590px',
      },
      backgroundImage: {
        'banner':
          "url('/src/assets/images/Backgrounds/fondoDash.png')",
        'request':
          "url('/src/assets/images/Pages/Header/screen_2x (2).jpg')",
          'white-banner':
          "url('/src/assets/images/Backgrounds/BannerReport.png')",
        'hero-magnolia':
          "url('/src/assets/images/Components/About/securityImages.jpg')"
      },
      animation: {
        'sidebar-typing': 'sidebar-typing 3.5s steps(40, end) forwards',
        'logo-assemble': 'logo-assemble 0.5s ease-in-out forwards',
      },
      keyframes: {
        'sidebar-typing': {
          'from': { width: '0', borderRight: '2px solid black' },
          'to': { width: 'calc(100% - 0.5ch)', borderRightColor: 'transparent' },
        },
        'logo-assemble': {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
    fontFamily: {
      display: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
    },
  },
  plugins: [],
}
