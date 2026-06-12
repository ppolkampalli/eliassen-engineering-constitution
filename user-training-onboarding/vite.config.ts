import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // The app imports laws/registry.json and workflows/registry.json from the
      // repo root at build time (LAW-10.6 single source of truth) — allow the
      // dev server to read one level above the app root.
      allow: ['..'],
    },
  },
});
