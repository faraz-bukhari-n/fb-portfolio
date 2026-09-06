import { createRequire } from 'node:module'
import { fileURLToPath, URL } from 'node:url'
import { templateCompilerOptions } from '@tresjs/core'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)
const cesiumMod = require('vite-plugin-cesium') as { default?: () => import('vite').Plugin } | (() => import('vite').Plugin)
const cesium = (typeof cesiumMod === 'function' ? cesiumMod : cesiumMod.default) as () => import('vite').Plugin

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/fb-portfolio/' : '/',
  plugins: [
    vue({
      ...templateCompilerOptions,
    }),
    cesium(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['three', 'mapbox-gl'],
  },
  build: {
    // Mapbox GL and Three.js are larger than Vite’s 500 kB hint; they load only on Home / Experience.
    chunkSizeWarningLimit: 2000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'three', test: /node_modules[\\/](?:three|@tresjs)\b/ },
            { name: 'mapbox', test: /node_modules[\\/]mapbox-gl\b/ },
            { name: 'd3', test: /node_modules[\\/]d3/ },
            { name: 'gsap', test: /node_modules[\\/]gsap\b/ },
            { name: 'markdown', test: /node_modules[\\/](?:markdown-it|dompurify)\b/ },
          ],
        },
      },
    },
  },
})
