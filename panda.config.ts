import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
  button: {
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  'input, textarea': {
    fontFamily: 'inherit',
  },
});

export default defineConfig({
  preflight: true,
  globalCss,
  include: ["./src/**/*.{js,jsx,ts,tsx,astro}"],
  exclude: [],
  jsxFramework: "preact",
  theme: {
    extend: {
      tokens: {
        colors: {
          breath: {
            bg: { value: "#1a3d0a" },
            text: { value: "#e8f5e9" },
            accent: { value: "#8bc34a" },
            muted: { value: "#c5e1a5" },
            accentLight: { value: "#aed581" },
            border: { value: "rgba(165, 214, 167, 0.3)" },
          },
          grounding: {
            bg: { value: "#fef9f3" },
            text: { value: "#5a5a5a" },
            textLight: { value: "#8a8a8a" },
            pink: { value: "#ffd6e0" },
            blue: { value: "#d4e4f7" },
            purple: { value: "#e8d9f5" },
          },
          home: {
            primary: { value: "#667eea" },
            secondary: { value: "#764ba2" },
          },
        },
        gradients: {
          home: { value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
          breath: { value: "linear-gradient(135deg, #2d5016 0%, #1a3d0a 50%, #0f2805 100%)" },
          grounding: { value: "linear-gradient(135deg, #d4e4f7 0%, #ffd6e0 50%, #e8d9f5 100%)" },
        },
        fonts: {
          body: { value: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif" },
        },
      },
    },
  },
  outdir: "styled-system",
});
