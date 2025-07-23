import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  define: {
    global: 'globalThis', // ✅ fix ReferenceError: global is not defined
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // ✅ also define it for esbuild
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill() // ✅ polyfill node core modules
      ],
    },
  },
  server: {
    port: 3000,
  },
})
