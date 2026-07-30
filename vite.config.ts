import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

function modulePreloadPlugin(): Plugin {
  return {
    name: 'module-preload',
    transformIndexHtml(_, ctx) {
      if (!ctx.bundle) return
      const entry = Object.values(ctx.bundle).find((c) => 'isEntry' in c && c.isEntry)
      if (!entry) return
      return [{ tag: 'link', attrs: { rel: 'modulepreload', href: '/' + entry.fileName }, injectTo: 'head' }]
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), modulePreloadPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['motion/react'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
})
