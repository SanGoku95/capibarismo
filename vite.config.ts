import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Use true for portability across environments
    port: Number(process.env.PORT) || 8080, // Use Vercel's port if provided
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          "vendor-ui": ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          "vendor-icons": ["react-icons", "lucide-react"],
          "vendor-animation": ["framer-motion"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-router": ["react-router-dom"],
          // Split large components
          "political-compass": ["src/components/political-compass/PoliticalCompass.tsx"],
        },
        // Optimize chunk names
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
}));

