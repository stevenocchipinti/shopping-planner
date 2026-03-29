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
  fontSize: 14,
  lineHeight: "20px",
  borderRadius: vars.radius.full,
  padding: "7px 10px",
  minHeight: 38,
  border: `1px solid ${vars.color.divider}`,
  color: vars.color.text,
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  transition: "transform 150ms ease, opacity 150ms ease, background 150ms ease",
  selectors: {
    '&:active': {
      transform: "scale(0.97)",
    },
  },
})

export const chipDone = style({
  background: vars.color.chipDone,
  borderColor: "transparent",
  color: vars.color.textMuted,
})

export const chipEmoji = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 7,
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
  lineHeight: "14px",
  backgroundColor: vars.color.divider,
  borderRadius: vars.radius.full,
  padding: "3px 7px",
  marginLeft: 6,
  fontSize: 12,
  fontWeight: 600,
})

export const chipQtyX = style({
  marginRight: 4,
  color: vars.color.textMuted,
})

export const shoppingContainer = style({
  padding: "4px 16px 120px",
  margin: "0 auto",
  maxWidth: 720,
})

export const shoppingContainerEmbedded = style({
  padding: "0 0 16px",
})

export const shoppingSection = style({
  margin: "0 0 4px",
  padding: 0,
  selectors: {
    '& + &': {
      borderTop: `1px solid ${vars.color.divider}`,
      paddingTop: 4,
    },
  },
})

export const shoppingItems = style({
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
  padding: "4px 0 8px",
})

export const shoppingSectionTitle = style({
  fontSize: 11,
  margin: "12px 0 4px",
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
    gap: 14,
    width: "100%",
    margin: 0,
    padding: "1rem 1.25rem",
    borderRadius: 28,
    color: vars.color.textMuted,
    cursor: "pointer",
    animation: `${zoomIn} 180ms ease`,
  },
])

export const placeholderImage = style({
  width: 40,
  height: 40,
  flex: "0 0 auto",
  objectFit: "contain",
})

export const placeholderText = style({
  margin: 0,
  textAlign: "center",
  fontSize: 14,
})

export const tableWrapper = style({
  maxWidth: 720,
  margin: "0 auto",
  padding: "4px 16px 120px",
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
  padding: "14px 16px",
  textAlign: "left",
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: vars.color.textMuted,
  borderBottom: `1px solid ${vars.color.divider}`,
})

export const tableCell = style({
  padding: "14px 16px",
  borderBottom: `1px solid ${vars.color.divider}`,
})

export const tableCellRight = style({
  textAlign: "right",
})

export const tableCellStrong = style({
  fontWeight: 700,
})

export const tableRowLast = style({})

globalStyle(`${tableRowLast} td, ${tableRowLast} th`, {
  borderBottom: 0,
})

export const headerSummaryCard = style([
  surfaceCard,
  {
    padding: "16px 18px",
    marginBottom: 12,
    background: vars.gradient.accent,
  },
])

export const headerSummaryRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
})

export const placeholderRow = style({
  color: vars.color.textMuted,
  textAlign: "center",
  padding: "3rem",
})

export const plannerChipCell = style({
  paddingLeft: 0,
  height: 84,
  width: "100%",
})

export const plannerChipContainer = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 6,
})

export const plannerAddButton = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  background: "transparent",
  border: `1px solid ${vars.color.divider}`,
  borderRadius: vars.radius.full,
  padding: "7px 13px",
  minHeight: 38,
  cursor: "pointer",
  color: vars.color.textMuted,
  fontSize: 13,
  fontWeight: 500,
  transition: "border-color 150ms ease, color 150ms ease, transform 150ms ease",
  WebkitTapHighlightColor: "transparent",
  selectors: {
    '&:hover': {
      borderColor: vars.color.textMuted,
      color: vars.color.text,
    },
    '&:active': {
      transform: "scale(0.97)",
    },
  },
})
