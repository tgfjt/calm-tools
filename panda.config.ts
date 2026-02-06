import { defineConfig, defineGlobalStyles, defineRecipe, defineSlotRecipe } from "@pandacss/dev";

// --- globalCss: 要素デフォルトスタイルのみ ---
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

// --- Recipes ---

const buttonRecipe = defineRecipe({
  className: 'button',
  description: 'Button component with primary, secondary, ghost variants',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    textDecoration: 'none',
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
  variants: {
    visual: {
      primary: {
        padding: '16px 32px',
        fontSize: '1.1rem',
        fontWeight: 500,
        borderRadius: '50px',
        background: 'linear-gradient(135deg, #ffd6e0, #e8d9f5)',
        color: '#5a5a5a',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
        },
      },
      secondary: {
        padding: '16px 32px',
        fontSize: '1.1rem',
        fontWeight: 500,
        borderRadius: '50px',
        background: 'white',
        color: '#5a5a5a',
        _hover: {
          background: '#f8f9fa',
        },
      },
      ghost: {
        padding: '1rem 2.5rem',
        fontSize: '1rem',
        borderRadius: '30px',
        background: 'rgba(139,195,74, 0.20)',
        color: '#c5e1a5',
        border: '1px solid rgba(165,214,167,0.4)',
        backdropFilter: 'blur(10px)',
        letterSpacing: '0.1em',
        _hover: {
          background: 'rgba(139,195,74, 0.30)',
          boxShadow: '0 0 20px rgba(139,195,74,0.3)',
          transform: 'translateY(-2px)',
        },
      },
    },
  },
  defaultVariants: {
    visual: 'primary',
  },
});

const cardRecipe = defineRecipe({
  className: 'card',
  description: 'Home screen card component',
  base: {
    padding: '2rem',
    borderRadius: '24px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    _hover: {
      transform: 'translateY(-4px)',
    },
  },
  variants: {
    visual: {
      breath: {
        background: 'rgba(139,195,74,0.2)',
        border: '2px solid rgba(165,214,167,0.4)',
      },
      grounding: {
        background: 'rgba(255,255,255,0.2)',
        border: '2px solid rgba(255,255,255,0.4)',
      },
    },
  },
});

const segmentedControlRecipe = defineSlotRecipe({
  className: 'segmented-control',
  description: 'Segmented control for pattern/duration selection',
  slots: ['root', 'item'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    item: {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },
  },
  variants: {
    visual: {
      pattern: {
        root: {
          gap: '1rem',
          flexWrap: 'wrap',
        },
        item: {
          padding: '1.2rem 1.5rem',
          borderRadius: '16px',
          border: '2px solid rgba(165,214,167,0.3)',
          background: 'rgba(139,195,74, 0.15)',
          minWidth: '160px',
          _selected: {
            background: 'rgba(139,195,74, 0.30)',
            borderColor: 'rgba(165,214,167, 0.60)',
            boxShadow: '0 0 20px rgba(139,195,74,0.3)',
          },
          _disabled: {
            opacity: 0.6,
          },
        },
      },
      duration: {
        root: {
          gap: '0.5rem',
        },
        item: {
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          border: '1px solid rgba(165,214,167, 0.2)',
          fontSize: '0.9rem',
          opacity: 0.7,
          _selected: {
            opacity: 1,
            background: 'rgba(139,195,74, 0.25)',
            borderColor: 'rgba(165,214,167, 0.5)',
          },
        },
      },
    },
  },
  defaultVariants: {
    visual: 'pattern',
  },
});

const timerRecipe = defineSlotRecipe({
  className: 'timer',
  description: 'Breath timer circle component',
  slots: ['circle', 'countdown', 'instruction'],
  base: {
    circle: {
      width: '280px',
      height: '280px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139,195,74,0.15) 0%, rgba(76,175,80,0.05) 100%)',
      border: '2px solid rgba(165,214,167, 0.3)',
      boxShadow: '0 0 40px rgba(139,195,74,0.2), inset 0 0 60px rgba(139,195,74,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    countdown: {
      fontSize: '4rem',
      fontWeight: 200,
      color: '#c5e1a5',
      lineHeight: '1.0',
    },
    instruction: {
      fontSize: '1.5rem',
      fontWeight: 300,
      color: '#aed581',
      letterSpacing: '0.2em',
    },
  },
});

const progressRecipe = defineSlotRecipe({
  className: 'progress',
  description: 'Grounding progress bar component',
  slots: ['track', 'fill'],
  base: {
    track: {
      width: '100%',
      height: '8px',
      background: 'rgba(255,255,255, 0.6)',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      background: 'linear-gradient(90deg, #ffd6e0, #e8d9f5)',
      borderRadius: '10px',
      transition: 'width 0.5s ease',
    },
  },
});

const inputRecipe = defineRecipe({
  className: 'input',
  description: 'Grounding text input component',
  base: {
    padding: '12px 20px',
    border: '2px solid rgba(255,255,255, 0.8)',
    borderRadius: '20px',
    fontSize: '1rem',
    background: 'white',
    color: '#5a5a5a',
    transition: 'all 0.3s ease',
    width: '100%',
    _focus: {
      borderColor: '#e8d9f5',
      boxShadow: '0 0 0 3px rgba(232,217,245, 0.3)',
      outline: 'none',
    },
    _placeholder: {
      color: '#8a8a8a',
    },
  },
});

const validationErrorRecipe = defineRecipe({
  className: 'validation-error',
  description: 'Validation error message component',
  base: {
    background: 'rgba(231,76,60, 0.1)',
    color: '#c0392b',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
});

const emptyStateRecipe = defineSlotRecipe({
  className: 'empty-state',
  description: 'Empty state component for history views',
  slots: ['root', 'icon', 'message', 'hint'],
  base: {
    root: {
      textAlign: 'center',
      padding: '40px',
    },
    icon: {
      fontSize: '4rem',
      opacity: 0.5,
    },
    message: {
      fontSize: '1rem',
    },
    hint: {
      fontSize: '0.9rem',
    },
  },
  variants: {
    visual: {
      breath: {
        root: {
          color: '#dcedc8',
        },
        message: {
          color: '#dcedc8',
        },
        hint: {
          color: '#c5e1a5',
        },
      },
      grounding: {
        root: {
          color: '#8a8a8a',
        },
        message: {
          color: '#8a8a8a',
        },
        hint: {
          color: '#8a8a8a',
        },
      },
    },
  },
  defaultVariants: {
    visual: 'grounding',
  },
});

const historyListRecipe = defineSlotRecipe({
  className: 'history-list',
  description: 'History list component for breath/grounding',
  slots: ['root', 'item'],
  base: {
    root: {
      overflowY: 'auto',
    },
  },
  variants: {
    visual: {
      breath: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          maxHeight: '200px',
        },
        item: {
          background: 'rgba(139,195,74, 0.1)',
          padding: '0.8rem 1.2rem',
          borderRadius: '12px',
          border: '1px solid rgba(165,214,167, 0.15)',
          fontSize: '0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#dcedc8',
        },
      },
      grounding: {
        root: {
          maxHeight: '400px',
        },
        item: {
          background: 'white',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          _hover: {
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            borderLeft: '3px solid #e8d9f5',
          },
        },
      },
    },
  },
});

// --- Config ---

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
            surfaceWhite: { value: "rgba(255, 255, 255, 0.2)" },
            surfaceWhiteMedium: { value: "rgba(255, 255, 255, 0.3)" },
            surfaceWhiteStrong: { value: "rgba(255, 255, 255, 0.5)" },
            surfaceWhiteStronger: { value: "rgba(255, 255, 255, 0.6)" },
            surfaceWhiteMax: { value: "rgba(255, 255, 255, 0.8)" },
            borderWhite: { value: "rgba(255, 255, 255, 0.4)" },
            borderWhiteStrong: { value: "rgba(255, 255, 255, 0.6)" },
            borderWhiteMax: { value: "rgba(255, 255, 255, 0.8)" },
            progressBg: { value: "rgba(255, 255, 255, 0.6)" },
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
        shadows: {
          soft: { value: "0 2px 8px rgba(0, 0, 0, 0.08)" },
          softMedium: { value: "0 2px 10px rgba(0, 0, 0, 0.08)" },
          softStrong: { value: "0 4px 15px rgba(0, 0, 0, 0.08)" },
          card: { value: "0 10px 40px rgba(0, 0, 0, 0.08)" },
          cardHover: { value: "0 6px 20px rgba(0, 0, 0, 0.08)" },
          btn: { value: "0 4px 15px rgba(0, 0, 0, 0.08)" },
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
        fontSizes: {
          display: { value: "2.5rem" },
          "heading-1": { value: "1.8rem" },
          "heading-2": { value: "1.5rem" },
          "heading-3": { value: "1.2rem" },
          "body-lg": { value: "1.1rem" },
          body: { value: "1.0rem" },
          "body-sm": { value: "0.9rem" },
          caption: { value: "0.85rem" },
        },
        fontWeights: {
          light: { value: "300" },
          regular: { value: "400" },
          medium: { value: "500" },
        },
        letterSpacings: {
          title: { value: "0.3em" },
          heading: { value: "0.2em" },
          card: { value: "0.15em" },
          button: { value: "0.1em" },
          caption: { value: "0.05em" },
        },
        lineHeights: {
          countdown: { value: "1.0" },
          description: { value: "1.4" },
          summary: { value: "1.6" },
          instruction: { value: "1.8" },
          welcome: { value: "2.0" },
        },
        spacing: {
          1: { value: "4px" },
          2: { value: "8px" },
          3: { value: "12px" },
          4: { value: "16px" },
          5: { value: "20px" },
          6: { value: "24px" },
          8: { value: "32px" },
          10: { value: "40px" },
          12: { value: "48px" },
        },
        radii: {
          sm: { value: "12px" },
          md: { value: "16px" },
          lg: { value: "20px" },
          xl: { value: "24px" },
          "2xl": { value: "30px" },
          full: { value: "50px" },
        },
        sizes: {
          container: { value: "600px" },
          touchTarget: { value: "44px" },
          breathCircle: { value: "280px" },
        },
      },
      recipes: {
        button: buttonRecipe,
        card: cardRecipe,
        input: inputRecipe,
        validationError: validationErrorRecipe,
      },
      slotRecipes: {
        segmentedControl: segmentedControlRecipe,
        timer: timerRecipe,
        progress: progressRecipe,
        emptyState: emptyStateRecipe,
        historyList: historyListRecipe,
      },
    },
  },
  outdir: "styled-system",
});
