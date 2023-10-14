import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5648,
    watch: {
      usePolling: false,
    },
    cors: true,
    proxy: {
      '/tree': {
        target: 'http://localhost:25500',
        changeOrigin: true,
        rewrite: (path) => path.replace('tree', ''),
      },
    }
  },
  build: {
    outDir: './build'
  },
  base: ''
})
