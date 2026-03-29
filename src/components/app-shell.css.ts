import { globalStyle, style } from "@vanilla-extract/css"

import { vars } from "../theme.css"
import { accentCard, mutedText, screen, surfaceCard, titleSerif } from "./ui.css"

export const homeContainer = style({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 32,
  textAlign: "center",
})

export const homeTitle = style([
  titleSerif,
  {
    marginBottom: 10,
    fontSize: "clamp(2.6rem, 10vw, 4.5rem)",
    lineHeight: 0.94,
  },
])

export const homeCopy = style([
  mutedText,
  {
    margin: "0 0 24px",
    maxWidth: "26rem",
    lineHeight: 1.6,
  },
])

export const appScreen = screen

export const pageShell = style({
  maxWidth: 720,
  margin: "0 auto",
  padding: "0 16px 40px",
})

export const heroCard = style([
  accentCard,
  {
    padding: 20,
    marginBottom: 12,
  },
])

export const heroTitle = style([
  titleSerif,
  {
    fontSize: "2rem",
    lineHeight: 1,
    marginBottom: 8,
  },
])

export const heroCopy = style([
  mutedText,
  {
    margin: 0,
    lineHeight: 1.6,
  },
])

export const settingsCard = style([
  surfaceCard,
  {
    padding: "16px 18px",
    marginBottom: 10,
  },
])

export const settingsRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
})

export const settingsCaption = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  color: vars.color.text,
  fontWeight: 600,
})

export const betaPill = style({
  padding: "4px 8px",
  borderRadius: vars.radius.full,
  background: vars.color.actionSelected,
  color: vars.color.textMuted,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
})

export const appBarShell = style({
  position: "sticky",
  top: 0,
  zIndex: 20,
  padding: "max(8px, env(safe-area-inset-top)) 16px 4px",
  backdropFilter: "blur(12px)",
  background: vars.color.overlay,
})

export const appBar = style({
  position: "relative",
  minHeight: 56,
  display: "grid",
  gridTemplateColumns: "40px minmax(0, 1fr) 40px",
  alignItems: "center",
})

export const appBarSlot = style({
  width: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

export const appBarButton = style({
  opacity: 0.56,
  selectors: {
    '&:hover': {
      opacity: 0.86,
    },
  },
})

export const appBarTitle = style([
  titleSerif,
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    padding: 0,
    lineHeight: 1,
    textAlign: "center",
    fontSize: "1.35rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
])

export const drawerContent = style({
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  paddingBottom: 12,
})

export const drawerHeader = style({
  display: "flex",
  justifyContent: "flex-end",
  margin: "10px 10px 0",
})

export const drawerHero = style({
  padding: "18px 18px 10px",
})

export const drawerTitle = style([
  titleSerif,
  {
    fontSize: 28,
    lineHeight: 1.1,
  },
])

export const drawerCopy = style([
  mutedText,
  {
    margin: "10px 0 0",
    fontSize: 14,
    lineHeight: 1.5,
  },
])

export const drawerDivider = style({
  height: 1,
  margin: "0 18px 12px",
  background: vars.color.divider,
  opacity: 0.6,
})

export const drawerList = style({
  display: "grid",
  gap: 4,
  padding: "0 12px 12px",
})

export const drawerItem = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  border: 0,
  borderRadius: 12,
  background: "transparent",
  color: vars.color.text,
  textDecoration: "none",
  padding: "12px 16px",
  textAlign: "left",
  cursor: "pointer",
  selectors: {
    '&:hover': {
      background: vars.color.actionSelected,
    },
  },
})

export const drawerItemIcon = style({
  display: "inline-flex",
  flexShrink: 0,
  color: vars.color.textMuted,
})

export const drawerItemLabel = style({
  fontWeight: 600,
})

export const drawerFooter = style({
  marginTop: "auto",
})

export const fab = style({
  position: "fixed",
  right: 20,
  bottom: "calc(78px + max(10px, env(safe-area-inset-bottom)))",
  zIndex: 16,
  width: 56,
  height: 56,
  borderRadius: "50%",
  border: 0,
  background: vars.gradient.primary,
  color: vars.color.primaryContrast,
  boxShadow: vars.shadow.float,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 120ms ease, filter 120ms ease, opacity 120ms ease",
  selectors: {
    '&:hover': {
      filter: "brightness(1.04)",
    },
    '&:active': {
      transform: "scale(0.98)",
    },
    '&:disabled': {
      cursor: "not-allowed",
      background: vars.color.divider,
      color: vars.color.textMuted,
      boxShadow: "none",
    },
  },
})

export const bottomNav = style([
  surfaceCard,
  {
    position: "fixed",
    bottom: "max(10px, env(safe-area-inset-bottom))",
    left: 16,
    right: 16,
    zIndex: 15,
    display: "flex",
    justifyContent: "center",
    gap: 4,
    padding: "4px 8px",
    minHeight: vars.size.navHeight,
    alignItems: "stretch",
    background: vars.gradient.shell,
    backdropFilter: "blur(12px)",
    boxShadow: vars.shadow.shell,
  },
])

export const bottomNavLink = style({
  flex: 1,
  minHeight: 52,
  borderRadius: 12,
  color: vars.color.textMuted,
  textDecoration: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  fontSize: 11,
  fontWeight: 600,
  selectors: {
    '&[data-active="true"]': {
      background: vars.color.actionSelected,
      color: vars.color.text,
    },
  },
})

export const bottomNavLabel = style({
  marginTop: 2,
})

export const recipeWrapper = style({
  maxWidth: 1000,
  margin: "0 auto",
  padding: 16,
})

export const recipeImage = style({
  width: "100%",
  objectFit: "cover",
  maxHeight: "40vh",
})

export const recipeBackButton = style({
  position: "absolute",
  top: 12,
  left: 24,
  background: vars.color.bg,
  color: vars.color.text,
  boxShadow: vars.shadow.soft,
})

export const recipeTitleRow = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 24,
  marginTop: 8,
})

export const recipeTitle = style([
  titleSerif,
  {
    fontSize: "2rem",
  },
])

export const recipeCard = style([
  surfaceCard,
  {
    padding: 16,
  },
])

export const recipeDescription = style({
  margin: "16px 0",
  lineHeight: 1.6,
})

export const recipeLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
})

export const recipesMasonry = style({
  display: "flex",
  marginLeft: "-1rem",
  padding: "1rem",
  width: "auto",
})

globalStyle(`${recipesMasonry} .masonry-column`, {
  paddingLeft: "1rem",
  backgroundClip: "padding-box",
})

export const recipeFigure = style({
  width: "100%",
  margin: "0 0 1rem",
})

export const recipeTileLink = style({
  textDecoration: "none",
})

export const recipeTileImage = style({
  borderRadius: 10,
  width: "100%",
  transition: "transform 120ms ease",
})

export const recipeTilePlaceholder = style([
  surfaceCard,
  {
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 120ms ease",
  },
])

globalStyle(`${recipeTileLink}:hover .${recipeTileImage}`, {
  transform: "translateY(-2px)",
})

globalStyle(`${recipeTileLink}:hover .${recipeTilePlaceholder}`, {
  transform: "translateY(-2px)",
})

export const recipeTilePlaceholderImage = style({
  height: 60,
})

export const recipeFigcaption = style([
  mutedText,
  {
    paddingTop: 6,
  },
])

export const emptyRecipes = style([
  surfaceCard,
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: "3rem",
    color: vars.color.textMuted,
    textAlign: "center",
  },
])
