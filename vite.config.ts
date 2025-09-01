// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  optimizeDeps: {
    include: ["prop-types"], // Force Vite to pre-bundle prop-types
    exclude: ["@stripe/stripe-js", "@stripe/react-stripe-js"], 
  },
})
    