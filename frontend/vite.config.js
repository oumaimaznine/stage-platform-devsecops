import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ["stage-platform.local", "localhost"],
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "http://nginx:80",
        changeOrigin: true,
      },
      "/storage": {
        target: "http://nginx:80",
        changeOrigin: true,
      },
    },
  },
});