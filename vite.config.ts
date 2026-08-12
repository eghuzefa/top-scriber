/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// SINGLEFILE=1 produces one self-contained JS bundle (no code splitting),
// used to package the app as a single shareable HTML file.
const singleFile = process.env.SINGLEFILE === '1'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: singleFile
    ? {
        cssCodeSplit: false,
        rollupOptions: { output: { inlineDynamicImports: true } },
      }
    : {},
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
