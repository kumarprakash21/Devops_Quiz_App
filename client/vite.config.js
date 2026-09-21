import { defineConfig } from "vite";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  server: {
    port: 5173,
    strictPort: true,
    proxy: { "/api": "http://localhost:3000" }
  }
});
