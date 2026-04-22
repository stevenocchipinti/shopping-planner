import { style } from "@vanilla-extract/css"

import { vars } from "../theme.css"
import {
  accentCard,
  mutedText,
  screen,
  surfaceCard,
  titleSerif,
} from "./ui.css"

export const homeContainer = style({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  textAlign: "center",
})

export const homeTitle = style([
  titleSerif,
  {
    marginBottom: "0.625rem",
    fontSize: "clamp(2.8rem, 10.5vw, 4.75rem)",
    lineHeight: 0.94,
  },
])

export const homeCopy = style([
  mutedText,
  {
    margin: "0 0 1.5rem",
    maxWidth: "26rem",
    lineHeight: 1.6,
  },
])

export const appScreen = style([
  screen,
  {
    viewTransitionName: "app-screen",
  },
])

export const shellWidth = style({
  width: "min(100% - 2rem, 45rem)",
  margin: "0 auto",
})

export const pageShell = style({
  maxWidth: "45rem",
  margin: "0 auto",
  padding: "0 1rem 2.5rem",
})

export const historyTabsWrap = style({
  position: "sticky",
  top: "calc(max(0.5rem, env(safe-area-inset-top)) + 3.75rem)",
  zIndex: 10,
  padding: "0.25rem 0 0.75rem",
  backdropFilter: "blur(0.75rem)",
})

export const heroCard = style([
  accentCard,
  {
    padding: "1.25rem",
    marginBottom: "0.75rem",
  },
])

export const heroTitle = style([
  titleSerif,
  {
    fontSize: "2rem",
    lineHeight: 1,
    marginBottom: "0.5rem",
  },
])

export const heroCopy = style([
  mutedText,
  {
    margin: 0,
    lineHeight: 1.6,
  },
])

export const statusInline = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  marginLeft: "0.5rem",
})

export const statusInlineButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.75rem",
  height: "1.75rem",
  borderRadius: vars.radius.full,
  border: `0.0625rem solid ${vars.color.divider}`,
  background: vars.color.surfaceMuted,
  color: vars.color.warning,
  cursor: "pointer",
  transition: "background 120ms ease, transform 120ms ease, color 120ms ease",
  selectors: {
    "&:hover": {
      background: vars.color.actionSelected,
      color: vars.color.text,
    },
    "&:active": {
      transform: "scale(0.96)",
    },
  },
})

export const statusInlineIcon = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
})

export const statusTooltip = style([
  surfaceCard,
  {
    position: "absolute",
    top: "calc(100% + 0.5rem)",
    left: 0,
    minWidth: "15rem",
    maxWidth: "18rem",
    padding: "0.75rem 0.875rem",
    color: vars.color.textMuted,
    fontSize: "0.8125rem",
    lineHeight: 1.5,
    boxShadow: vars.shadow.soft,
    whiteSpace: "normal",
  },
])

export const warningCallout = style({
  display: "grid",
  gap: "0.375rem",
  marginBottom: "1rem",
  padding: "0.875rem 1rem",
  borderRadius: "0.875rem",
  border: `0.0625rem solid color-mix(in srgb, ${vars.color.warning} 28%, transparent)`,
  background: `linear-gradient(135deg, color-mix(in srgb, ${vars.color.warning} 16%, ${vars.color.surface}), color-mix(in srgb, ${vars.color.surface} 94%, ${vars.color.warning} 6%))`,
  color: vars.color.text,
})

export const warningCalloutLabel = style({
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: vars.color.warning,
})

export const warningCalloutText = style({
  margin: 0,
  color: vars.color.text,
  lineHeight: 1.55,
})

export const statusTooltipRecipe = style({
  marginLeft: 0,
  left: "auto",
  right: 0,
})

export const settingsCard = style([
  surfaceCard,
  {
    padding: "1rem 1.125rem",
    marginBottom: "0.625rem",
  },
])

export const settingsRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
})

export const settingsCaption = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  color: vars.color.text,
  fontWeight: 600,
})

export const betaPill = style({
  padding: "0.25rem 0.5rem",
  borderRadius: vars.radius.full,
  background: vars.color.actionSelected,
  color: vars.color.textMuted,
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
})

export const appBarShell = style({
  position: "sticky",
  top: 0,
  zIndex: 20,
  padding: "max(0.5rem, env(safe-area-inset-top)) 1rem 0.25rem",
  backdropFilter: "blur(0.75rem)",
})

export const appBar = style({
  position: "relative",
  minHeight: "3.5rem",
  display: "grid",
  gridTemplateColumns: "2.5rem minmax(0, 1fr) 2.5rem",
  alignItems: "center",
})

export const appBarSlot = style({
  width: "2.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

export const appBarButton = style({
  opacity: 0.56,
  selectors: {
    "&:hover": {
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
    gap: "0.25rem",
    minHeight: "2.5rem",
    padding: 0,
    lineHeight: 1,
    textAlign: "center",
    fontSize: "1.5rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
])

export const drawerContent = style({
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  paddingBottom: "0.75rem",
})

export const drawerHeader = style({
  display: "flex",
  justifyContent: "flex-end",
  margin: "0.625rem 0.625rem 0",
})

export const drawerHero = style({
  padding: "1.125rem 1.125rem 0.625rem",
})

export const drawerTitle = style([
  titleSerif,
  {
    fontSize: "1.75rem",
    lineHeight: 1.1,
  },
])

export const drawerCopy = style([
  mutedText,
  {
    margin: "0.625rem 0 0",
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
])

export const drawerDivider = style({
  height: 1,
  margin: "0 1.125rem 0.75rem",
  background: vars.color.divider,
  opacity: 0.6,
})

export const drawerList = style({
  display: "grid",
  gap: "0.25rem",
  padding: "0 0.75rem 0.75rem",
})

export const drawerItem = style({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  width: "100%",
  border: 0,
  borderRadius: "0.75rem",
  background: "transparent",
  color: vars.color.text,
  textDecoration: "none",
  padding: "0.75rem 1rem",
  textAlign: "left",
  cursor: "pointer",
  selectors: {
    "&:hover": {
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
  viewTransitionName: "app-fab",
  width: "3.5rem",
  height: "3.5rem",
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
    "&:hover": {
      filter: "brightness(1.04)",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
    "&:disabled": {
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
    bottom: "max(0.625rem, env(safe-area-inset-bottom))",
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(calc(100% - 2rem), 45rem)",
    zIndex: 15,
    display: "flex",
    justifyContent: "center",
    gap: "0.25rem",
    padding: "0.25rem",
    minHeight: vars.size.navHeight,
    alignItems: "stretch",
    background: vars.gradient.shell,
    backdropFilter: "blur(0.75rem)",
    boxShadow: vars.shadow.shell,
  },
])

export const bottomNavLink = style({
  flex: 1,
  position: "relative",
  overflow: "hidden",
  minHeight: "3.25rem",
  border: 0,
  borderRadius: "0.75rem",
  background: "transparent",
  color: vars.color.textMuted,
  textDecoration: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.125rem",
  fontSize: "0.6875rem",
  fontWeight: 600,
  cursor: "pointer",
  selectors: {
    '&[data-active="true"]': {
      color: vars.color.text,
    },
  },
})

export const bottomNavActivePill = style({
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  background: vars.color.actionSelected,
  viewTransitionName: "bottom-nav-active-pill",
})

export const bottomNavLinkContent = style({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.125rem",
  minHeight: "3.25rem",
})

export const bottomNavLabel = style({
  marginTop: "0.125rem",
})

export const recipeWrapper = style({
  maxWidth: "62.5rem",
  margin: "0 auto",
  padding: "1rem",
})

export const recipeImage = style({
  width: "100%",
  objectFit: "cover",
  maxHeight: "40vh",
})

export const recipeBackButton = style({
  position: "absolute",
  top: "0.75rem",
  left: "1.5rem",
  background: vars.color.bg,
  color: vars.color.text,
  boxShadow: vars.shadow.soft,
})

export const recipeTitleRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "1.5rem",
  marginTop: "0.5rem",
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
    padding: "1rem",
  },
])

export const recipeDescription = style({
  margin: "1rem 0",
  lineHeight: 1.6,
})

export const recipeLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
})
