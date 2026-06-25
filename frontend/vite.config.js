import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
      interval: 1500   // Poll cada 1.5s — reduce CPU en D:\ sobre WSL2
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — cambia rarísimo, máxima vida en caché
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI y estado
          'vendor-ui': ['lucide-react', 'sonner', 'zustand'],
          // Mapa — pesado (~600kb), solo carga en páginas de catastro
          'vendor-map': ['leaflet', 'react-leaflet'],
          // PDF — pesado, solo carga al generar reportes
          'vendor-pdf': ['jspdf', 'jspdf-autotable'],
          // Formularios
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
        }
      }
    }
  }
})
