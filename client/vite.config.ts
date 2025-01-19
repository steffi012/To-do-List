import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enables global test methods like `describe`, `test`, etc.
    environment: 'jsdom', // Sets up a browser-like environment
    transformMode: {
      web: [/\.[jt]sx?$/], // Ensures JSX and TSX files are transformed
    },
  },
});
