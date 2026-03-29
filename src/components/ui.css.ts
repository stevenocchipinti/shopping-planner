import { keyframes, style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"

import { vars } from "../theme.css"

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

const slideUp = keyframes({
  from: { opacity: 0, transform: "translate3d(0, 18px, 0) scale(0.98)" },
  to: { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
})

const slideInLeft = keyframes({
  from: { transform: "translate3d(-100%, 0, 0)" },
  to: { transform: "translate3d(0, 0, 0)" },
})

const pulse = keyframes({
  from: { transform: "translateX(-55%)" },
  to: { transform: "translateX(110%)" },
})

const spin = keyframes({
  to: { transform: "rotate(360deg)" },
})

export const srOnly = style({
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
})

export const screen = style({
  maxWidth: 720,
  margin: "0 auto",
  minHeight: "100dvh",
  paddingBottom: "calc(120px + max(10px, env(safe-area-inset-bottom)))",
})

export const surfaceCard = style({
  background: vars.color.surface,
  border: `1px solid ${vars.color.divider}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.soft,
})

export const accentCard = style([
  surfaceCard,
  {
    background: vars.gradient.accent,
  },
])

export const eyebrow = style({
  margin: 0,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: vars.color.textMuted,
})

export const titleSerif = style({
  margin: 0,
  fontFamily: vars.font.serif,
  fontWeight: 600,
  letterSpacing: "-0.02em",
})

export const mutedText = style({
  color: vars.color.textMuted,
})

export const field = style({
  display: "grid",
  gap: vars.space.xs,
  marginBottom: vars.space.md,
})

export const fieldLabel = style({
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: vars.color.textMuted,
})

export const inputShell = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  minHeight: 48,
  borderRadius: 12,
  border: `1px solid ${vars.color.divider}`,
  background: vars.color.surfaceMuted,
  padding: "0 14px",
  transition: `border-color ${vars.duration.fast} ease, box-shadow ${vars.duration.fast} ease, background ${vars.duration.fast} ease`,
  selectors: {
    "&:focus-within": {
      borderColor: vars.color.primary,
      boxShadow: `0 0 0 4px ${vars.color.focus}`,
      background: vars.color.surface,
    },
  },
})

export const input = style({
  flex: 1,
  minWidth: 0,
  border: 0,
  outline: 0,
  background: "transparent",
  color: vars.color.text,
  fontSize: 16,
  padding: "13px 0",
  selectors: {
    "&::placeholder": {
      color: vars.color.textMuted,
    },
    '&[type="number"]::-webkit-inner-spin-button': {
      WebkitAppearance: "none",
      margin: 0,
    },
  },
})

export const inputReadOnly = style({
  cursor: "text",
})

export const inputAdornment = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  color: vars.color.textMuted,
})

export const helperText = style({
  margin: 0,
  fontSize: 13,
  lineHeight: 1.5,
  color: vars.color.textMuted,
})

export const fieldButton = style({
  width: "100%",
  justifyContent: "flex-start",
  border: 0,
  padding: 0,
  background: "transparent",
  textAlign: "left",
})

export const button = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: vars.space.xs,
    minHeight: 40,
    borderRadius: 12,
    border: "1px solid transparent",
    padding: "0 18px",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1,
    textDecoration: "none",
    cursor: "pointer",
    transition: `transform ${vars.duration.fast} ease, filter ${vars.duration.fast} ease, background ${vars.duration.fast} ease, border-color ${vars.duration.fast} ease, color ${vars.duration.fast} ease`,
    selectors: {
      "&:hover": {
        filter: "brightness(1.03)",
      },
      "&:active": {
        transform: "scale(0.98)",
      },
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.6,
        filter: "none",
        transform: "none",
      },
    },
  },
  variants: {
    variant: {
      solid: {
        background: vars.gradient.primary,
        color: vars.color.primaryContrast,
        boxShadow: vars.shadow.soft,
      },
      outline: {
        background: vars.color.surface,
        borderColor: vars.color.divider,
        color: vars.color.text,
      },
      ghost: {
        background: "transparent",
        color: vars.color.textMuted,
      },
      subtle: {
        background: vars.color.actionSelected,
        color: vars.color.text,
      },
      danger: {
        background: "transparent",
        borderColor: vars.color.divider,
        color: vars.color.danger,
      },
    },
    size: {
      sm: { minHeight: 36, padding: "0 14px", fontSize: 13 },
      md: {},
      lg: { minHeight: 46, padding: "0 20px" },
    },
    fullWidth: {
      true: { width: "100%" },
      false: {},
    },
  },
  defaultVariants: {
    variant: "outline",
    size: "md",
    fullWidth: false,
  },
})

export const iconButton = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid transparent",
    background: "transparent",
    color: vars.color.text,
    cursor: "pointer",
    transition: `opacity ${vars.duration.fast} ease, transform ${vars.duration.fast} ease, background ${vars.duration.fast} ease`,
    selectors: {
      "&:hover": {
        background: vars.color.actionSelected,
      },
      "&:active": {
        transform: "scale(0.96)",
      },
      "&:disabled": {
        opacity: 0.45,
        cursor: "not-allowed",
      },
    },
  },
  variants: {
    tone: {
      default: {},
      muted: { color: vars.color.textMuted },
    },
  },
  defaultVariants: {
    tone: "default",
  },
})

export const spinner = style({
  width: 28,
  height: 28,
  borderRadius: "50%",
  border: `3px solid ${vars.color.divider}`,
  borderTopColor: vars.color.primary,
  animation: `${spin} 0.9s linear infinite`,
})

export const progressTrack = style({
  position: "absolute",
  right: 0,
  bottom: 0,
  left: 0,
  height: 2,
  overflow: "hidden",
  background: vars.color.divider,
})

export const progressIndicator = style({
  position: "absolute",
  inset: 0,
  width: "45%",
  background: vars.gradient.primary,
  animation: `${pulse} 1.1s ease-in-out infinite`,
})

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 40,
  background: vars.color.backdrop,
  backdropFilter: "blur(8px)",
  animation: `${fadeIn} ${vars.duration.normal} ease`,
})

export const dialogViewport = style({
  position: "fixed",
  inset: 0,
  zIndex: 41,
  display: "grid",
  placeItems: "center",
  padding: 12,
})

export const dialogPanel = style({
  width: "min(460px, calc(100vw - 24px))",
  maxHeight: "min(100dvh - 24px, 760px)",
  overflow: "auto",
  borderRadius: 20,
  background: vars.color.surface,
  border: `1px solid ${vars.color.divider}`,
  boxShadow: vars.shadow.modal,
  animation: `${slideUp} ${vars.duration.normal} ease`,
  '@media': {
    "screen and (max-width: 640px)": {
      width: "100vw",
      height: "100dvh",
      maxHeight: "100dvh",
      borderRadius: 0,
    },
  },
})

export const dialogForm = style({
  display: "flex",
  flexDirection: "column",
  minHeight: "100%",
})

export const dialogHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.sm,
  padding: "20px 20px 10px",
})

export const dialogTitle = style({
  margin: 0,
  fontFamily: vars.font.serif,
  fontSize: 30,
  lineHeight: 1,
  fontWeight: 600,
  letterSpacing: "-0.02em",
})

export const dialogBody = style({
  padding: "10px 20px 8px",
  display: "flex",
  flexDirection: "column",
})

export const dialogDescription = style({
  margin: 0,
  color: vars.color.textMuted,
  lineHeight: 1.5,
})

export const dialogFooter = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  padding: "14px 20px 20px",
  marginTop: "auto",
  flexWrap: "wrap",
})

export const dialogFooterGrow = style({
  marginRight: "auto",
})

export const drawerViewport = style({
  position: "fixed",
  inset: 0,
  zIndex: 41,
  display: "flex",
})

export const drawerPanel = style({
  width: "min(88vw, 340px)",
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  background: vars.color.surface,
  borderRight: `1px solid ${vars.color.divider}`,
  boxShadow: vars.shadow.modal,
  animation: `${slideInLeft} ${vars.duration.normal} ease`,
})

export const popover = style({
  position: "fixed",
  zIndex: 45,
  width: "min(360px, calc(100vw - 24px))",
  maxWidth: "calc(100vw - 24px)",
  borderRadius: 18,
  background: vars.color.surface,
  border: `1px solid ${vars.color.divider}`,
  boxShadow: vars.shadow.modal,
  overflow: "hidden",
  animation: `${slideUp} ${vars.duration.fast} ease`,
})

export const switchRoot = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  width: 48,
  height: 30,
  flexShrink: 0,
})

export const switchInput = style({
  position: "absolute",
  inset: 0,
  margin: 0,
  opacity: 0,
  cursor: "pointer",
})

export const switchTrack = style({
  width: "100%",
  height: "100%",
  borderRadius: vars.radius.full,
  background: vars.color.divider,
  border: `1px solid ${vars.color.border}`,
  transition: `background ${vars.duration.fast} ease, border-color ${vars.duration.fast} ease`,
  selectors: {
    [`${switchInput}:checked + &`]: {
      background: vars.color.focus,
      borderColor: vars.color.primary,
    },
  },
})

export const switchThumb = style({
  position: "absolute",
  top: 3,
  left: 3,
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: vars.color.surface,
  boxShadow: vars.shadow.soft,
  transition: `transform ${vars.duration.fast} ease, background ${vars.duration.fast} ease`,
  selectors: {
    [`${switchInput}:checked ~ &`]: {
      transform: "translateX(18px)",
      background: vars.color.primary,
    },
  },
})

export const segmentedControl = style({
  display: "grid",
  gap: 4,
  width: "100%",
  padding: 4,
  borderRadius: 14,
  background: vars.gradient.accent,
  border: `1px solid ${vars.color.divider}`,
})

export const segmentedButton = style({
  minHeight: 40,
  border: 0,
  borderRadius: 10,
  background: "transparent",
  color: vars.color.textMuted,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.xs,
  cursor: "pointer",
  fontWeight: 600,
  transition: `background ${vars.duration.fast} ease, color ${vars.duration.fast} ease, transform ${vars.duration.fast} ease`,
  selectors: {
    '&[data-selected="true"]': {
      background: vars.color.surface,
      color: vars.color.text,
      boxShadow: vars.shadow.soft,
    },
    "&:active": {
      transform: "scale(0.98)",
    },
  },
})

export const tags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 8,
})

export const tag = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  minHeight: 30,
  padding: "0 10px",
  borderRadius: vars.radius.full,
  background: vars.color.actionSelected,
  color: vars.color.text,
  fontSize: 13,
  fontWeight: 600,
})

export const tagRemove = style({
  width: 18,
  height: 18,
  padding: 0,
  border: 0,
  borderRadius: "50%",
  background: "transparent",
  color: vars.color.textMuted,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
})

export const autocompleteRoot = style({
  position: "relative",
  marginBottom: vars.space.md,
})

export const autocompleteList = style([
  surfaceCard,
  {
    position: "absolute",
    zIndex: 20,
    top: "calc(100% + 8px)",
    left: 0,
    right: 0,
    padding: 8,
    maxHeight: 240,
    overflowY: "auto",
  },
])

export const autocompleteItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.sm,
  width: "100%",
  padding: "10px 12px",
  border: 0,
  borderRadius: 12,
  background: "transparent",
  color: vars.color.text,
  cursor: "pointer",
  textAlign: "left",
  selectors: {
    '&[data-highlighted="true"]': {
      background: vars.color.actionSelected,
    },
  },
})

export const autocompleteItemText = style({
  flex: 1,
  minWidth: 0,
})

export const autocompleteDelete = style({
  width: 28,
  height: 28,
  border: 0,
  borderRadius: 8,
  background: "transparent",
  color: vars.color.textMuted,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
})

export const fadePresence = style({
  transition: `opacity ${vars.duration.fast} ease, transform ${vars.duration.fast} ease`,
  selectors: {
    '&[data-visible="false"]': {
      opacity: 0,
      transform: "translateY(4px)",
      pointerEvents: "none",
    },
    '&[data-visible="true"]': {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
})
