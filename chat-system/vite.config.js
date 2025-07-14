import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
     server: {
    host: '0.0.0.0', // ← allows access from your phone
    port: 5173, // optional if default
  },
  plugins: [react(),  tailwindcss()],
})
