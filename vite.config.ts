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
})
