import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const repoRoot = __dirname;

export default defineConfig({
  root: path.join(repoRoot, 'client'),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.join(repoRoot, 'client'),
      '@shared': path.join(repoRoot, 'shared'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    proxy: {
      '/api': { target: 'http://127.0.0.1:3000', changeOrigin: true },
    },
  },
});
