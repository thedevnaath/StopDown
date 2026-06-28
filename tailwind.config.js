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
        'neo-bg': '#F8F8F8', // Light background
        'neo-text': '#212121', // Dark text and borders
        'neo-primary': '#007BFF', // Vibrant blue
        'neo-accent': '#FFC107', // Bright yellow
        'neo-green': '#28a745', // Success green
        'neo-red': '#dc3545', // Danger red
        'neo-gray': '#E0E0E0', // Light gray for subtle elements
      },
      fontFamily: {
        // Assume 'Inter Variable' and 'Space Mono' are imported via Google Fonts or similar
        sans: ['Inter Variable', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px #212121',
        'neo-md': '4px 4px 0px #212121',
        'neo-lg': '6px 6px 0px #212121',
        'neo-xl': '8px 8px 0px #212121',
        'neo-2xl': '12px 12px 0px #212121',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}