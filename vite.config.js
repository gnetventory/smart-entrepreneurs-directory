import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ai-vendor': ['@google/generative-ai'],
          'utils-vendor': ['date-fns', 'uuid'],
          'media-vendor': ['html2canvas'],
        },
      },
    },
    // Warn if any chunk exceeds 400 KB gzipped
    chunkSizeWarningLimit: 400,
  },

  // Test configuration (Vitest)
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    globals: true,
  },
});
