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
            bg: { value: "#0a1a0a" },
            text: { value: "#b8d4a3" },
            accent: { value: "#b8d4a3" },
            muted: { value: "#b8d4a3" },
            accentLight: { value: "#b8d4a3" },
            textAlt: { value: "rgba(184, 212, 163, 0.7)" },
            border: { value: "rgba(184, 212, 163, 0.25)" },
            borderMedium: { value: "rgba(184, 212, 163, 0.35)" },
            borderStrong: { value: "rgba(184, 212, 163, 0.5)" },
            borderStronger: { value: "rgba(184, 212, 163, 0.6)" },
            borderWeak: { value: "rgba(184, 212, 163, 0.15)" },
            borderWeaker: { value: "rgba(184, 212, 163, 0.1)" },
            surface: { value: "rgba(184, 212, 163, 0.08)" },
            surfaceHover: { value: "rgba(184, 212, 163, 0.12)" },
            surfaceMedium: { value: "rgba(184, 212, 163, 0.15)" },
            surfaceStrong: { value: "rgba(184, 212, 163, 0.2)" },
            surfaceStronger: { value: "rgba(184, 212, 163, 0.25)" },
            glow: { value: "rgba(184, 212, 163, 0.2)" },
            glowWeak: { value: "rgba(184, 212, 163, 0.1)" },
            circleBg: { value: "rgba(184, 212, 163, 0.03)" },
          },
          grounding: {
            bg: { value: "#faf8f5" },
            text: { value: "#454545" },
            textLight: { value: "#404040" },
            pink: { value: "#c8b8a8" },
            blue: { value: "rgba(200, 184, 168, 0.2)" },
            purple: { value: "#c8b8a8" },
            purpleAlpha: { value: "rgba(200, 184, 168, 0.3)" },
            hoverBg: { value: "#f5f2ef" },
            surfaceWhite: { value: "rgba(200, 184, 168, 0.08)" },
            surfaceWhiteMedium: { value: "rgba(200, 184, 168, 0.12)" },
            surfaceWhiteStrong: { value: "rgba(200, 184, 168, 0.15)" },
            surfaceWhiteStronger: { value: "rgba(200, 184, 168, 0.2)" },
            surfaceWhiteMax: { value: "rgba(200, 184, 168, 0.25)" },
            borderWhite: { value: "rgba(200, 184, 168, 0.25)" },
            borderWhiteStrong: { value: "rgba(200, 184, 168, 0.4)" },
            borderWhiteMax: { value: "rgba(200, 184, 168, 0.5)" },
            progressBg: { value: "rgba(200, 184, 168, 0.2)" },
          },
          home: {
            primary: { value: "#1a1a2e" },
            secondary: { value: "#e2e2f0" },
          },
          error: {
            bg: { value: "rgba(231, 76, 60, 0.1)" },
            text: { value: "#c0392b" },
            accent: { value: "#e74c3c" },
            hoverBg: { value: "rgba(255, 100, 100, 0.2)" },
          },
        },
        shadows: {
          soft: { value: "0 1px 3px rgba(0,0,0,0.06)" },
          softMedium: { value: "0 1px 4px rgba(0,0,0,0.06)" },
          softStrong: { value: "0 2px 6px rgba(0,0,0,0.06)" },
          card: { value: "0 1px 3px rgba(0,0,0,0.04)" },
          cardHover: { value: "0 2px 6px rgba(0,0,0,0.06)" },
          btn: { value: "0 1px 3px rgba(0,0,0,0.04)" },
        },
        gradients: {
          home: { value: "#1a1a2e" },
          breath: { value: "#0a1a0a" },
          breathCircle: { value: "transparent" },
          grounding: { value: "#faf8f5" },
          groundingBtn: { value: "#c8b8a8" },
          groundingProgress: { value: "#c8b8a8" },
        },
        fonts: {
          body: { value: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif" },
        },
      },
    },
  },
  outdir: "styled-system",
});
