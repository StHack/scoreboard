/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

const year = new Date().getFullYear()
const title = `Sthack CTF Edition ${year}`
const description = `Welcome to the scoreboard of Sthack CTF Edition ${year}`

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/optc-box-manager/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4400',
        ws: true,
      },
    },
  },
  assetsInclude: ['**/*.riv'],
  build: {
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: ['node_modules'],
  },
  define: {
    'import.meta.env.VITE_APP_TITLE': JSON.stringify(title),
    'import.meta.env.VITE_APP_DESCRIPTION': JSON.stringify(description),
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    viteTsconfigPaths(),
    svgrPlugin(),
    VitePWA({
      devOptions: {
        enabled: false,
        type: 'module',
      },
      injectRegister: 'inline',
      registerType: 'autoUpdate',

      strategies: 'generateSW',
      workbox: {
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 50000000,
        globPatterns: ['**/*.{js,css,json,html,png,svg}'],
      },

      manifest: {
        short_name: `Sthack CTF ${year}`,
        name: title,
        description,
        lang: 'en',
        dir: 'ltr',
        orientation: 'any',
        display: 'standalone',
        theme_color: '#222221',
        background_color: '#FFFFFF',
        start_url: './',
        scope: '.',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '72x72 96x96 128x128 256x256',
          },
          {
            src: 'logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
