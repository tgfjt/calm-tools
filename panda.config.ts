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
            textAlt: { value: "#dcedc8" },
            border: { value: "rgba(165, 214, 167, 0.3)" },
            borderMedium: { value: "rgba(165, 214, 167, 0.4)" },
            borderStrong: { value: "rgba(165, 214, 167, 0.5)" },
            borderStronger: { value: "rgba(165, 214, 167, 0.6)" },
            borderWeak: { value: "rgba(165, 214, 167, 0.2)" },
            borderWeaker: { value: "rgba(165, 214, 167, 0.15)" },
            surface: { value: "rgba(139, 195, 74, 0.1)" },
            surfaceHover: { value: "rgba(139, 195, 74, 0.15)" },
            surfaceMedium: { value: "rgba(139, 195, 74, 0.2)" },
            surfaceStrong: { value: "rgba(139, 195, 74, 0.25)" },
            surfaceStronger: { value: "rgba(139, 195, 74, 0.3)" },
            glow: { value: "rgba(139, 195, 74, 0.3)" },
            glowWeak: { value: "rgba(139, 195, 74, 0.2)" },
            circleBg: { value: "rgba(76, 175, 80, 0.05)" },
          },
          grounding: {
            bg: { value: "#fef9f3" },
            text: { value: "#5a5a5a" },
            textLight: { value: "#8a8a8a" },
            pink: { value: "#ffd6e0" },
            blue: { value: "#d4e4f7" },
            purple: { value: "#e8d9f5" },
            purpleAlpha: { value: "rgba(232, 217, 245, 0.3)" },
            hoverBg: { value: "#f8f9fa" },
          },
          home: {
            primary: { value: "#667eea" },
            secondary: { value: "#764ba2" },
          },
          error: {
            bg: { value: "rgba(231, 76, 60, 0.1)" },
            text: { value: "#c0392b" },
            accent: { value: "#e74c3c" },
            hoverBg: { value: "rgba(255, 100, 100, 0.2)" },
          },
        },
        gradients: {
          home: { value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
          breath: { value: "linear-gradient(135deg, #2d5016 0%, #1a3d0a 50%, #0f2805 100%)" },
          breathCircle: { value: "radial-gradient(circle, rgba(139, 195, 74, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%)" },
          grounding: { value: "linear-gradient(135deg, #d4e4f7 0%, #ffd6e0 50%, #e8d9f5 100%)" },
          groundingBtn: { value: "linear-gradient(135deg, #ffd6e0, #e8d9f5)" },
          groundingProgress: { value: "linear-gradient(90deg, #ffd6e0, #e8d9f5)" },
        },
        fonts: {
          body: { value: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif" },
        },
      },
    },
  },
  outdir: "styled-system",
});
