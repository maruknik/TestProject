import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [react(),tailwindcss()],
}
