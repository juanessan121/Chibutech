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
        // Vite 8 (Rolldown) requiere manualChunks como función, no como objeto.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // Core React — cambia rarísimo, máxima vida en caché
          if (/[\\/](react|react-dom|react-router-dom)[\\/]/.test(id)) return 'vendor-react';
          // UI y estado
          if (/[\\/](lucide-react|sonner|zustand)[\\/]/.test(id)) return 'vendor-ui';
          // Mapa — pesado (~600kb), solo carga en páginas de catastro
          if (/[\\/](leaflet|react-leaflet)[\\/]/.test(id)) return 'vendor-map';
          // PDF — pesado, solo carga al generar reportes
          if (/[\\/](jspdf|jspdf-autotable)[\\/]/.test(id)) return 'vendor-pdf';
          // Formularios
          if (/[\\/](react-hook-form|@hookform|zod)[\\/]/.test(id)) return 'vendor-forms';
        }
      }
    }
  }
})
