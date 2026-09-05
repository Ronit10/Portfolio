import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built site works from a domain root *or* a
// sub-path (GitHub Pages project sites, Netlify preview folders, etc.).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Keep the whole WebGL stack — including react-reconciler and the
        // other renderer-only deps — out of the critical path, so the page
        // paints and is readable before three.js is ever parsed.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          if (
            /[\\/]node_modules[\\/](three|three-stdlib|three-mesh-bvh|@react-three|react-reconciler|its-fine|zustand|suspend-react|react-use-measure|maath|camera-controls|meshline|troika[^/\\]*|detect-gpu|stats\.js|@mediapipe|tunnel-rat|@use-gesture)[\\/]/.test(
              id,
            )
          ) {
            return 'three';
          }
          if (id.includes('framer-motion')) return 'motion';
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
          return 'vendor';
        },
      },
    },
  },
});
