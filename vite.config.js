import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

const isLocal = process.env.BUILD_TARGET === 'local'
const isGitHubPages = process.env.BUILD_TARGET === 'ghpages'

export default defineConfig({
  plugins: isLocal ? [react(), viteSingleFile()] : [react()],
  base: isLocal ? './' : isGitHubPages ? '/inventory-management/' : './',
  build: isLocal
    ? {
        target: 'es2015',
        rollupOptions: { output: { format: 'iife' } },
      }
    : {},
})
