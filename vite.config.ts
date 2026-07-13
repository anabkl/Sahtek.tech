import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-icon.svg'],
      manifest: {
        name: 'صحّتك - Sahtek',
        short_name: 'Sahtek',
        description: 'Breast Cancer Awareness for Moroccan Women',
        theme_color: '#D63384',
        background_color: '#FFF5F7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        lang: 'ar',
        dir: 'rtl',
        categories: ['health', 'medical', 'education'],
        icons: [
          { src: '/pwa-icon.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: '/pwa-icon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: '/pwa-icon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Fonts are self-hosted, so they are precached from our own origin by the
        // woff2 glob below. The old runtimeCaching rules for fonts.googleapis.com
        // and fonts.gstatic.com are gone: the app makes no request to Google.
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        // 59 subsetted woff2 files push the precache past the 2 MiB default.
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
