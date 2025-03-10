import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "http://localhost:5001",
      "/uploads/": "http://localhost:5001",
    },
  },
  build: {
    rollupOptions: {
      external: ['react-webcam'],
    }
  }
});
