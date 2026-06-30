import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves from /FitDex/; local dev uses /
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/FitDex/' : '/',
  plugins: [react(), tailwindcss()],
}))
