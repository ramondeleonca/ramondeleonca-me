import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import media from './scripts/media.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    // compress media/ into public/media/ before dev or build (cached, only changed files are re-encoded)
    { name: 'media', buildStart: media }
  ],
  // only the site itself; the old demos/ and prototypes/ pages are not part of it
  optimizeDeps: { entries: ['index.html'] },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (
            id.includes('react-router-dom') ||
            id.includes('@remix-run') ||
            id.includes('react-router')
          ) {
            return 'react-router';
          } else if (id.includes("gsap")) {
            return "gsap";
          }
        }
      }
    }
  }
})
