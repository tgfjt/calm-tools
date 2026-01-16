import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx,astro}"],
  exclude: [],
  jsxFramework: "preact",
  theme: {
    extend: {
      tokens: {
        colors: {
          // Breath theme (green)
          breath: {
            bg: { value: "#1a3d0a" },
            text: { value: "#e8f5e9" },
            accent: { value: "#8bc34a" },
            muted: { value: "#c5e1a5" },
          },
          // Grounding theme (pastel)
          grounding: {
            bg: { value: "#fef9f3" },
            text: { value: "#5a5a5a" },
            textLight: { value: "#8a8a8a" },
            pink: { value: "#ffd6e0" },
            blue: { value: "#d4e4f7" },
            purple: { value: "#e8d9f5" },
          },
          // Home theme
          home: {
            primary: { value: "#667eea" },
            secondary: { value: "#764ba2" },
          },
        },
      },
    },
  },
  outdir: "styled-system",
});
