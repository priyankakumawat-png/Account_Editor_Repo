import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import polyfillNode from "rollup-plugin-polyfill-node";

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      global: "globalThis",
    },
  },
  build: {
    rollupOptions: {
      plugins: [polyfillNode()],
    },
  },
});
