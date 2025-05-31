/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? 'https://hall-of-fame.sthack.fr/' : '/',
  server: {
    port: 3001,
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
    'import.meta.env.VITE_APP_TITLE': JSON.stringify(`Sthack Hall of Fame`),
    'import.meta.env.VITE_APP_DESCRIPTION': JSON.stringify(
      `Welcome to the Sthack Hall of Fame`,
    ),
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
        short_name: `Sthack HoF`,
        name: `Sthack Hall of Fame`,
        description: `Welcome to the Sthack Hall of Fame`,
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
}))
