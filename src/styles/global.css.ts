import { globalStyle, keyframes, style } from "@vanilla-extract/css"

import { vars } from "../theme.css"

const backgroundDrift = keyframes({
  "0%": { transform: "translate3d(0, 0, 0) scale(1)" },
  "100%": { transform: "translate3d(0, -16px, 0) scale(1.02)" },
})

globalStyle("html", {
  background: vars.color.bg,
  colorScheme: "light",
  WebkitTapHighlightColor: "transparent",
})

globalStyle('[data-theme="dark"]', {
  colorScheme: "dark",
})

globalStyle("body", {
  margin: 0,
  minHeight: "100dvh",
  background: `radial-gradient(circle at top, ${vars.gradient.accent}, transparent 40%), ${vars.color.bg}`,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
})

globalStyle("body::before", {
  content: "",
  position: "fixed",
  inset: 0,
  pointerEvents: "none",
  background: `linear-gradient(180deg, ${vars.gradient.accent}, transparent 32%)`,
  opacity: 0.85,
  animation: `${backgroundDrift} 14s ease-in-out infinite alternate`,
})

globalStyle("#root", {
  minHeight: "100dvh",
  isolation: "isolate",
})

globalStyle("*", {
  boxSizing: "border-box",
})

globalStyle("*::selection", {
  background: vars.color.focus,
})

globalStyle("button, input, textarea, select", {
  font: "inherit",
})

globalStyle("a", {
  color: "inherit",
  textDecorationColor: vars.color.divider,
})

globalStyle("img", {
  maxWidth: "100%",
  display: "block",
})

globalStyle("ul", {
  paddingLeft: "1.2rem",
})

globalStyle("em-emoji-picker", {
  vars: {
    "--rgb-accent": "90, 138, 104",
  },
})

export const appRoot = style({
  minHeight: "100dvh",
  position: "relative",
})
