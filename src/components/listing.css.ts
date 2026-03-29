import { globalStyle, keyframes, style } from "@vanilla-extract/css"

import { vars } from "../theme.css"
import { surfaceCard } from "./ui.css"

const zoomIn = keyframes({
  from: { opacity: 0, transform: "scale(0.96)" },
  to: { opacity: 1, transform: "scale(1)" },
})

export const chip = style({
  display: "inline-flex",
  alignItems: "center",
  background: vars.color.chip,
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  borderRadius: vars.radius.full,
  padding: "0.4375rem 0.625rem",
  minHeight: "2.375rem",
  border: `0.0625rem solid ${vars.color.divider}`,
  color: vars.color.text,
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  transition: "transform 150ms ease, opacity 150ms ease, background 150ms ease",
  selectors: {
    "&:active": {
      transform: "scale(0.97)",
    },
  },
})

export const chipDone = style({
  background: vars.color.chipDone,
  borderColor: "transparent",
  color: vars.color.textMuted,
})

export const chipNoQuantity = style({
  paddingRight: "0.75rem",
})

export const chipEmoji = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "0.4375rem",
  flexShrink: 0,
})

export const chipEmojiDone = style({
  opacity: 0.45,
  filter: "grayscale(1)",
})

export const chipValue = style({
  fontWeight: 500,
})

export const chipValueDone = style({
  textDecorationLine: "line-through",
  opacity: 0.45,
})

export const chipQty = style({
  display: "inline-flex",
  alignItems: "center",
  lineHeight: "0.875rem",
  backgroundColor: vars.color.divider,
  borderRadius: vars.radius.full,
  padding: "0.1875rem 0.4375rem",
  marginLeft: "0.375rem",
  fontSize: "0.75rem",
  fontWeight: 600,
})

export const chipQtyX = style({
  marginRight: "0.25rem",
  color: vars.color.textMuted,
})

export const shoppingContainer = style({
  padding: "0.25rem 1rem 7.5rem",
  margin: "0 auto",
  maxWidth: "45rem",
})

export const shoppingContainerEmbedded = style({
  padding: "0 0 1rem",
})

export const shoppingSection = style({
  margin: "0 0 0.25rem",
  padding: 0,
  selectors: {
    "& + &": {
      borderTop: `0.0625rem solid ${vars.color.divider}`,
      paddingTop: 4,
    },
  },
})

export const shoppingItems = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.375rem",
  padding: "0.25rem 0 0.5rem",
})

export const shoppingSectionTitle = style({
  fontSize: "0.6875rem",
  margin: "0.75rem 0 0.25rem",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: vars.color.textMuted,
})

export const placeholderCard = style([
  surfaceCard,
  {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.875rem",
    width: "100%",
    margin: 0,
    padding: "1rem 1.25rem",
    borderRadius: "1.75rem",
    color: vars.color.textMuted,
    cursor: "pointer",
    animation: `${zoomIn} 180ms ease`,
  },
])

export const placeholderImage = style({
  width: "3.125rem",
  height: "3.125rem",
  flex: "0 0 auto",
  objectFit: "contain",
})

export const placeholderText = style({
  margin: 0,
  textAlign: "center",
  fontSize: "0.875rem",
})

export const tableWrapper = style({
  maxWidth: "45rem",
  margin: "0 auto",
  padding: "0.25rem 1rem 7.5rem",
})

export const tableCard = style([
  surfaceCard,
  {
    overflow: "hidden",
  },
])

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
})

export const tableHeadCell = style({
  padding: "0.875rem 1rem",
  textAlign: "left",
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: vars.color.textMuted,
  borderBottom: `0.0625rem solid ${vars.color.divider}`,
})

export const tableCell = style({
  padding: "0.875rem 1rem",
  borderBottom: `0.0625rem solid ${vars.color.divider}`,
})

export const tableCellRight = style({
  textAlign: "right",
})

export const tableCellStrong = style({
  fontWeight: 500,
})

export const tableRowLast = style({})

globalStyle(`${tableRowLast} td, ${tableRowLast} th`, {
  borderBottom: 0,
})

export const plannerRowLast = style({})

globalStyle(`${plannerRowLast} td, ${plannerRowLast} th`, {
  borderBottom: 0,
})

export const headerSummaryCard = style([
  surfaceCard,
  {
    padding: "1rem 1.125rem",
    marginBottom: "0.75rem",
    background: vars.gradient.accent,
  },
])

export const headerSummaryRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "0.75rem",
})

export const placeholderRow = style({
  color: vars.color.textMuted,
  textAlign: "center",
  padding: "3rem",
})

export const plannerChipCell = style({
  paddingLeft: 0,
  height: "5.25rem",
  width: "100%",
})

export const plannerChipContainer = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.375rem",
})

export const plannerAddButton = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.3125rem",
  background: "transparent",
  border: `0.0625rem solid ${vars.color.divider}`,
  borderRadius: vars.radius.full,
  padding: "0.4375rem 0.8125rem",
  minHeight: "2.375rem",
  cursor: "pointer",
  color: vars.color.textMuted,
  fontSize: "0.8125rem",
  fontWeight: 500,
  transition: "border-color 150ms ease, color 150ms ease, transform 150ms ease",
  WebkitTapHighlightColor: "transparent",
  selectors: {
    "&:hover": {
      borderColor: vars.color.textMuted,
      color: vars.color.text,
    },
    "&:active": {
      transform: "scale(0.97)",
    },
  },
})
