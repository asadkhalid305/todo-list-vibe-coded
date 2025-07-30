import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// Vite configuration for Vue 3 Todo App
export default defineConfig({
  // Base URL for GitHub Pages deployment
  base: process.env.NODE_ENV === "production" ? "/todo-list-vibe-coded/" : "/",

  // Plugins for Vue 3 SFC support
  plugins: [vue()],

  // Path resolution for cleaner imports
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // Use @ for src/ directory
    },
  },

  // Development server configuration
  server: {
    port: 3000, // Default port (will auto-increment if busy)
    open: true, // Auto-open browser
    host: "localhost", // Host configuration
  },

  // Build configuration
  build: {
    outDir: "dist", // Output directory
    sourcemap: false, // Disable sourcemaps in production
  },
});
