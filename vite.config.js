import { defineConfig } from 'vite';

export default defineConfig({
  root: 'Frontend',
  build: {
    outDir: '../dist'
  },
  server: {
    port: 3000,
    open: true
  }
});