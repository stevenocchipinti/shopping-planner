import { createGlobalTheme, createThemeContract } from "@vanilla-extract/css"

export const vars = createThemeContract({
  color: {
    primary: null,
    primaryLight: null,
    primaryDark: null,
    primaryContrast: null,
    secondary: null,
    bg: null,
    surface: null,
    surfaceMuted: null,
    text: null,
    textMuted: null,
    border: null,
    divider: null,
    chip: null,
    chipDone: null,
    actionSelected: null,
    focus: null,
    overlay: null,
    backdrop: null,
    success: null,
    warning: null,
    danger: null,
  },
  gradient: {
    primary: null,
    accent: null,
    shell: null,
  },
  shadow: {
    float: null,
    soft: null,
    shell: null,
    modal: null,
  },
  font: {
    sans: null,
    serif: null,
  },
  radius: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
    full: null,
  },
  space: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  size: {
    touch: null,
    navHeight: null,
  },
  duration: {
    fast: null,
    normal: null,
  },
})

export const themeValues = {
  light: {
    color: {
      primary: "#5a8a68",
      primaryLight: "#7ba587",
      primaryDark: "#3d6a4c",
      primaryContrast: "#fbfcfb",
      secondary: "#a38560",
      bg: "#f7f3ed",
      surface: "#fffcf7",
      surfaceMuted: "rgba(45, 54, 48, 0.015)",
      text: "#2d3630",
      textMuted: "rgba(45, 54, 48, 0.55)",
      border: "rgba(45, 54, 48, 0.06)",
      divider: "rgba(45, 54, 48, 0.08)",
      chip: "rgba(45, 54, 48, 0.025)",
      chipDone: "rgba(45, 54, 48, 0.012)",
      actionSelected: "rgba(45, 54, 48, 0.06)",
      focus: "rgba(90, 138, 104, 0.35)",
      overlay: "rgba(255, 252, 247, 0.92)",
      backdrop: "rgba(45, 54, 48, 0.18)",
      success: "#4f8962",
      warning: "#b07f3d",
      danger: "#b85d57",
    },
    gradient: {
      primary: "linear-gradient(135deg, #6d9b79 0%, #4a7e58 100%)",
      accent: "linear-gradient(135deg, rgba(90, 138, 104, 0.08), rgba(163, 133, 96, 0.04))",
      shell: "rgba(255, 252, 247, 0.95)",
    },
    shadow: {
      float: "0 12px 32px rgba(45, 54, 48, 0.14)",
      soft: "0 8px 24px rgba(45, 54, 48, 0.06)",
      shell: "0 10px 30px rgba(45, 54, 48, 0.1)",
      modal: "0 24px 64px rgba(45, 54, 48, 0.16)",
    },
  },
  dark: {
    color: {
      primary: "#8fb89a",
      primaryLight: "#aed0b6",
      primaryDark: "#6d9b79",
      primaryContrast: "#0d1a10",
      secondary: "#c4a882",
      bg: "#171c19",
      surface: "#1e241f",
      surfaceMuted: "rgba(255, 255, 255, 0.02)",
      text: "#e6e0d8",
      textMuted: "rgba(230, 224, 216, 0.58)",
      border: "rgba(230, 224, 216, 0.06)",
      divider: "rgba(230, 224, 216, 0.08)",
      chip: "rgba(230, 224, 216, 0.04)",
      chipDone: "rgba(230, 224, 216, 0.015)",
      actionSelected: "rgba(230, 224, 216, 0.08)",
      focus: "rgba(143, 184, 154, 0.35)",
      overlay: "rgba(30, 36, 31, 0.94)",
      backdrop: "rgba(0, 0, 0, 0.42)",
      success: "#86c796",
      warning: "#d3a867",
      danger: "#d58780",
    },
    gradient: {
      primary: "linear-gradient(135deg, #8fb89a 0%, #6d9b79 100%)",
      accent: "linear-gradient(135deg, rgba(143, 184, 154, 0.08), rgba(196, 168, 130, 0.04))",
      shell: "rgba(30, 36, 31, 0.95)",
    },
    shadow: {
      float: "0 16px 40px rgba(0, 0, 0, 0.28)",
      soft: "0 8px 24px rgba(0, 0, 0, 0.18)",
      shell: "0 10px 30px rgba(0, 0, 0, 0.24)",
      modal: "0 28px 80px rgba(0, 0, 0, 0.42)",
    },
  },
} as const

const sharedTheme = {
  font: {
    sans: '"Outfit", sans-serif',
    serif: '"Cormorant Garamond", serif',
  },
  radius: {
    sm: "10px",
    md: "14px",
    lg: "18px",
    xl: "24px",
    full: "999px",
  },
  space: {
    xs: "6px",
    sm: "10px",
    md: "16px",
    lg: "20px",
    xl: "28px",
  },
  size: {
    touch: "40px",
    navHeight: "60px",
  },
  duration: {
    fast: "120ms",
    normal: "220ms",
  },
} as const

createGlobalTheme(":root", vars, {
  ...themeValues.light,
  ...sharedTheme,
})

createGlobalTheme('[data-theme="dark"]', vars, {
  ...themeValues.dark,
  ...sharedTheme,
})

export type ThemeMode = keyof typeof themeValues
