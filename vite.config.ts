import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/diploma/", // 👈 Правильный base для GitHub Pages
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
