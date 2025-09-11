import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['recharts', 'react-is'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-popover'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          appwrite: ['appwrite'],
          openai: ['openai'],
          motion: ['framer-motion'],
          charts: ['recharts', 'react-is'],
        },
      },
    },
  },
  // Remove this line - it was preventing env vars from working
  // define: {
  //   'process.env': {}
  // },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 5173,
    host: true,
  },
})
