import { globalStyle, keyframes, style } from "@vanilla-extract/css"

import { vars } from "../theme.css"

const backgroundDrift = keyframes({
  "0%": { transform: "translate3d(0, 0, 0) scale(1)" },
  "100%": { transform: "translate3d(0, -16px, 0) scale(1.02)" },
})

const screenTransitionIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

const screenTransitionOut = keyframes({
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
})

const screenTransitionInFromLeft = keyframes({
  from: {
    opacity: 0,
    transform: "translateX(-56px)",
  },
  to: {
    opacity: 1,
    transform: "translateX(0)",
  },
})

const screenTransitionOutToRight = keyframes({
  from: {
    opacity: 1,
    transform: "translateX(0)",
  },
  to: {
    opacity: 0,
    transform: "translateX(40px)",
  },
})

const screenTransitionInFromRight = keyframes({
  from: {
    opacity: 0,
    transform: "translateX(56px)",
  },
  to: {
    opacity: 1,
    transform: "translateX(0)",
  },
})

const screenTransitionOutToLeft = keyframes({
  from: {
    opacity: 1,
    transform: "translateX(0)",
  },
  to: {
    opacity: 0,
    transform: "translateX(-40px)",
  },
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

globalStyle("::view-transition-group(app-screen)", {
  animationDuration: "280ms",
})

globalStyle("::view-transition-old(app-screen)", {
  animation: `${screenTransitionOut} 220ms ease both`,
  mixBlendMode: "normal",
})

globalStyle("::view-transition-new(app-screen)", {
  animation: `${screenTransitionIn} 280ms cubic-bezier(0.22, 1, 0.36, 1) both`,
  mixBlendMode: "normal",
})

globalStyle('html[data-nav-direction="list"]::view-transition-old(app-screen)', {
  animation: `${screenTransitionOutToRight} 240ms ease both`,
})

globalStyle('html[data-nav-direction="list"]::view-transition-new(app-screen)', {
  animation: `${screenTransitionInFromLeft} 320ms cubic-bezier(0.22, 1, 0.36, 1) both`,
})

globalStyle('html[data-nav-direction="planner"]::view-transition-old(app-screen)', {
  animation: `${screenTransitionOutToLeft} 240ms ease both`,
})

globalStyle('html[data-nav-direction="planner"]::view-transition-new(app-screen)', {
  animation: `${screenTransitionInFromRight} 320ms cubic-bezier(0.22, 1, 0.36, 1) both`,
})

globalStyle("::view-transition-group(bottom-nav-active-pill)", {
  animationDuration: "320ms",
  animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
})

globalStyle("::view-transition-old(bottom-nav-active-pill)", {
  mixBlendMode: "normal",
})

globalStyle("::view-transition-new(bottom-nav-active-pill)", {
  mixBlendMode: "normal",
})

globalStyle("::view-transition-group(app-fab)", {
  zIndex: 17,
})

globalStyle("::view-transition-old(app-fab)", {
  animation: "none",
  mixBlendMode: "normal",
})

globalStyle("::view-transition-new(app-fab)", {
  animation: "none",
  mixBlendMode: "normal",
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
