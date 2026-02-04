import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/", // Set base to '/' for custom domain deployment
  plugins: [react()],
});
