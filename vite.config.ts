import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
  },
  optimizeDeps: {
    include: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-progress',
      'react-icons'
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
