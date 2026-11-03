import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets load cleanly on Vercel, Netlify, and GitHub Pages
  server: {
    port: 3000,
    open: false,
  }
})
