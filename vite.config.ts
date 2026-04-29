import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    target: 'baseline-widely-available',
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React - rarely changes
          'vendor-react': ['react', 'react-dom'],

          // Router - changes occasionally
          'vendor-router': ['react-router-dom'],

          // State management
          // 'vendor-state': ['zustand', '@tanstack/react-query'],

          // UI library (if using)
          // 'vendor-ui': ['@headlessui/react', '@heroicons/react'],
        },
      },
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom'],
  },

  server: {
    port: 3000,
    hmr: {
      overlay: true,
    },
  },

  // Vitest configuration
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    exclude: ['src/**/*.cy.{ts,tsx}'],
    css: true,
    mockReset: true,
    clearMocks: true,
  },
}));

export function defineUserConfig(config) {
  return defineConfig(({ mode }) => ({
    ...config,
    test: {
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      globals: true,
      include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
      exclude: ['src/**/*.cy.{ts,tsx}'],
      css: true,
      mockReset: true,
      clearMocks: true,
    },
  }));
}