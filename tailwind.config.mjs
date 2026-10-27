/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    screens: {
      // Mobile
      'xs': '320px',       // Mobile Small
      'sm': '375px',       // Mobile Medium
      'md': '425px',       // Mobile Large
      // Tablets
      'tab-sm': '600px',   // Tablet Small
      'tab': '768px',      // Tablet Medium
      'tab-lg': '820px',   // Tablet Large
      // Laptops
      'lg': '1024px',      // Laptop Small
      'xl': '1280px',      // Laptop Medium
      '2xl': '1366px',     // Laptop Large
      // Desktops
      '3xl': '1440px',     // Desktop Small
      '4xl': '1600px',     // Desktop Medium
      '5xl': '1920px',     // Desktop Large
    },
    extend: {
      colors: {
        'brand-navy': {
          DEFAULT: '#0b2240',
          light: '#133259',
          dark: '#071830',
        },
        'brand-gold': {
          DEFAULT: '#b38f43',
          light: '#d4b36a',
          dark: '#8a6e33',
        },
        'brand-cream': {
          DEFAULT: '#fcfaf2',
          dark: '#f5f0e0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        kannada: ['Noto Serif Kannada', 'serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(11, 34, 64, 0.08)',
        'card-hover': '0 12px 40px rgba(11, 34, 64, 0.15)',
        'glass': '0 8px 32px rgba(11, 34, 64, 0.12)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(1deg)' },
          '66%': { transform: 'translateY(8px) rotate(-1deg)' },
        },
        'shimmer': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(179, 143, 67, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(179, 143, 67, 0.6)' },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
