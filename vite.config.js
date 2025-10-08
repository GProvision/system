import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/arg": {
        target: "https://apis.datos.gob.ar/georef/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/arg/, ""),
      },
      "/api": {
        target: import.meta?.env?.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/back": {
        target:
          import.meta?.env?.VITE_API_BACKUP ||
          "https://backup-xnwm.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/back/, ""),
      },
    },
  },
});
