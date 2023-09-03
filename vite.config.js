import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {//para servir el mismo dominio
    proxy: {
      '/socket.io': {
        target: '/',
        ws: true
      }
    }
  }
})
