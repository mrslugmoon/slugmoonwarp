import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import 'path' module

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This alias maps '@/' to the absolute path of your client's 'src' directory.
      // Make sure this matches your tsconfig.json 'paths' configuration.
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist', // Ensure this matches your npm build script
  }
});
