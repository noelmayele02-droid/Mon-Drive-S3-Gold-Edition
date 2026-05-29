import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Forcer Vite à écouter sur le port 5173
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    strictPort: true // Bloque le démarrage si le port 5173 n'est pas disponible
  }
})