/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'declic': {
          blue: '#2563EB',
          coral: '#FF6B35',
          green: '#10B981',
          amber: '#F59E0B',
          dark: '#1F2937',
          light: '#F3F4F6',
        },
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Poppins', 'sans-serif'],
        'accent': ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
