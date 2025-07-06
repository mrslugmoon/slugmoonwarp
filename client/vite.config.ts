// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Explicitly mark 'next/navigation' as external.
      // This tells Rollup (used by Vite) not to try and bundle this module,
      // as it's expected to be provided by the Next.js environment at runtime.
      external: ['next/navigation'],
    },
  },
});
