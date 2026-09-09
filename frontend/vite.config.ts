import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // El chunk 3D (three/drei/postprocessing) es grande a propósito: se carga
    // de forma diferida y sólo cuando el recorrido entra en viewport.
    chunkSizeWarningLimit: 1100,
  },
})
