/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // ArtisanMarket Brand Colors
        rust: {
          50: '#FEF3E2',
          100: '#FCE4B8',
          200: '#F9D18A',
          300: '#F5BC5C',
          400: '#F1A83B',
          500: '#B45309', // Primary rust color
          600: '#A04A08',
          700: '#8B4007',
          800: '#763605',
          900: '#5D2A04',
        },
        cream: {
          50: '#FEFCF3',
          100: '#FEF9E7',
          200: '#FDF2D0',
          300: '#FCEAB8',
          400: '#FAE1A1',
          500: '#F9D889',
          600: '#F7CF72',
          700: '#F5C65A',
          800: '#F3BD43',
          900: '#F1B42B',
        },
        brown: {
          50: '#F7F4F2',
          100: '#EDE6E0',
          200: '#DBC8B8',
          300: '#C9AA90',
          400: '#B78C68',
          500: '#8B4513', // Deep brown
          600: '#7A3D11',
          700: '#69350F',
          800: '#582D0D',
          900: '#47250B',
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'display': ['DM Sans', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'container': '1280px',
      },
      width: {
        '70': '280px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
