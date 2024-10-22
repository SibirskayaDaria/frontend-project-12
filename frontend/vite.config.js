import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './frontend',  // Убедитесь, что путь корректен
  build: {
    rollupOptions: {
      input: './frontend/index.html',  // Укажите путь к вашему index.html
    },
  },
  optimizeDeps: {
    include: [],  // Здесь можно указать зависимости, которые нужно предварительно собрать
  }
})
