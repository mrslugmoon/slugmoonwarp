// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // <--- Import 'path' module

export default defineConfig({
  plugins: [react()],
  resolve: { // <--- Add this resolve block
    alias: {
      "@": path.resolve(__dirname, "./src"), // <--- Define the @ alias
    },
  },
  build: {
    rollupOptions: {
      external: ['next/navigation'],
    },
  },
});
