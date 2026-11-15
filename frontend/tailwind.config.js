/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4C5FF5',
          dark: '#3949DB',
          navy: '#2F3EB5',
          soft: '#EEF1FE',
          lavender: '#DCE3FB',
        },
        ink: '#151A2D',
        muted: '#8C93A8',
        line: '#E9EBF2',
        canvas: '#F4F5FA',
        completed: '#EDF0FF',
        pending: '#FDEEEF',
        danger: '#EE5D5D',
        success: '#1FA97A',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px -20px rgba(21, 26, 45, 0.28)',
        fab: '0 14px 30px -8px rgba(76, 95, 245, 0.55)',
      },
    },
  },
  plugins: [],
};
