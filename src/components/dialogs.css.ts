import { style } from "@vanilla-extract/css"

import { vars } from "../theme.css"
import { fadePresence, segmentedButton, segmentedControl } from "./ui.css"

export const alert = style([
  fadePresence,
  {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    minHeight: 36,
    padding: "0 12px",
    borderRadius: vars.radius.full,
    background: vars.color.actionSelected,
    color: vars.color.success,
    fontSize: 13,
    fontWeight: 700,
  },
])

export const dialogHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px 8px 24px",
})

export const dialogActions = style({
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
  padding: "12px 20px 20px",
  marginTop: "auto",
})

export const spacer = style({
  flexGrow: 1,
})

export const openDialogActions = style({
  display: "flex",
  flexDirection: "column",
  minWidth: 250,
  gap: 16,
})

export const centeredText = style({
  textAlign: "center",
})

export const dayPicker = style([
  segmentedControl,
  {
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    marginBottom: "1.5rem",
  },
])

export const dayPickerButton = segmentedButton

export const numberPicker = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 20,
  margin: "0.5rem 0 1rem",
})

export const numberInput = style({
  width: "5.5rem",
})

export const numberInputField = style({
  textAlign: "center",
})

export const emojiPopoverContent = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
})

export const emojiPickerWrap = style({
  margin: "0 auto",
})

export const emojiPickerFooter = style({
  display: "flex",
  justifyContent: "flex-end",
  padding: 10,
  borderTop: `1px solid ${vars.color.divider}`,
})
