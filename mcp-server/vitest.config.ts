import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  test: {
    globals: true,
    include: ["src/**/*.test.ts", "ui/src/**/*.test.{ts,tsx}"],
    environmentMatchGlobs: [
      ["ui/src/**/*.test.tsx", "jsdom"],
      ["ui/src/**/*.test.ts", "jsdom"],
      ["src/**/*.test.ts", "node"],
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
