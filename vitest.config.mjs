// Vitest configuration: a fast, Vite-powered test runner with a Jest-like API.
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react"; // lets Vitest understand JSX
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // mirror the "@/..." import alias from jsconfig.json
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "jsdom", // fake browser (window, document, localStorage) inside Node
    setupFiles: ["./tests/setup.js"], // runs before every test file
    include: ["tests/**/*.test.{js,jsx}"],
  },
});
