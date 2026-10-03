import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative asset paths work on GitHub project pages
// (https://user.github.io/repo/) and on a custom domain.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
