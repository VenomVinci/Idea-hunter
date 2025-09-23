import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf7ff',
          100: '#f1e8ff',
          200: '#e0caff',
          300: '#caa3ff',
          400: '#a36aff',
          500: '#7c3aed',
          600: '#6b2fd3',
          700: '#5928b3',
          800: '#4a238f',
          900: '#3b1c73'
        }
      },
      boxShadow: {
        glow: '0 10px 30px rgba(124, 58, 237, 0.35)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: []
};

export default config;