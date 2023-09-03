import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {//para servir el mismo dominio
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true
      }
    }
  },
  build: {
    //para redirigir las solicitudes a /socket.io al servidor de desarrollo
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true
      }
    }
  },
  base: '/tic-tac-toe-online/',
  server: {
    base: '/tic-tac-toe-online/'
  }
})
