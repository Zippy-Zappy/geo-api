import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexiones externas (como navegador al contenedor)
    port: 3000,       // Coincide con el Dockerfile y docker-compose
    strictPort: true, // Lanza error si el puerto ya está en uso
  }
})