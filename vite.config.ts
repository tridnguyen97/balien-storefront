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
    target: 'es2020', // Better targeting for modern browsers
    sourcemap: false, // Disable source maps in production for smaller bundles
    minify: 'esbuild', // Use esbuild for faster minification
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React - rarely changes
          'vendor-react': ['react', 'react-dom'],

          // Router - changes occasionally
          'vendor-router': ['react-router-dom'],

          // State management
          'vendor-state': [
            '@reduxjs/toolkit',
            'react-redux',
            '@tanstack/react-query'
          ],

          // UI library (Ant Design)
          'vendor-ui': [
            'antd',
            '@ant-design/icons'
          ],

          // Form validation
          'vendor-form': [
            'react-hook-form',
            'zod',
            '@hookform/resolvers/zod'
          ],

          // Vendor - other commonly used libraries
          'vendor-other': [
            'lodash',
            'date-fns'
          ]
        },
      },
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@reduxjs/toolkit',
      'react-redux',
      '@tanstack/react-query',
      'antd',
      '@ant-design/icons',
      'react-hook-form',
      'zod',
      '@hookform/resolvers/zod'
    ],
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