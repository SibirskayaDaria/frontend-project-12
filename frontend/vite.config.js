import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002, // Vite-сервер работает на 5002
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001', // Исправленный порт на 5001
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://127.0.0.1:5001',
        ws: true,
      },
    },    
  },
});
