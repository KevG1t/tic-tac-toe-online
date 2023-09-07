import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
//
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'client/dist' // Especifica el directorio de salida como "dist"
  }
})
