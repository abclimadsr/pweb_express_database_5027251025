import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // request ke /products diteruskan ke Express, jadi tidak perlu CORS
    proxy: { "/products": "http://localhost:3000" },
  },
})