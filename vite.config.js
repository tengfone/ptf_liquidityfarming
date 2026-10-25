import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Same output directory as react-scripts so the Vercel project settings keep working
    outDir: 'build',
    // web3 v4 bundles its crypto deps; the app is a single ~1.2 MB chunk
    chunkSizeWarningLimit: 1500
  },
  server: {
    port: 3000,
    open: true
  }
})
