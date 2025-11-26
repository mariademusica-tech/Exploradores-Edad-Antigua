import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Això permet que process.env.API_KEY funcioni al navegador després de fer el build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});