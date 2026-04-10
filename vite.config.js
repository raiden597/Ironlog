import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Use the hand-written sw.js in /public instead of auto-generating one
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      // Tell Workbox which files to precache (injected into sw.js at build time)
      injectManifest: {
        injectionPoint: undefined, // we handle caching manually in sw.js
      },
      manifest: {
        name: 'IronLog — Workout Tracker',
        short_name: 'IronLog',
        description: 'A minimal, modern workout tracker.',
        theme_color: '#080808',
        background_color: '#080808',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      devOptions: {
        enabled: true, // lets you test SW in dev mode
      },
    }),
  ],
})
