import { style } from "@vanilla-extract/css"

import { vars } from "../theme.css"
import { fadePresence, segmentedButton, segmentedControl } from "./ui.css"

export const alert = style([
  fadePresence,
  {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    minHeight: "2.25rem",
    padding: "0 0.75rem",
    borderRadius: vars.radius.full,
    background: vars.color.actionSelected,
    color: vars.color.success,
    fontSize: "0.8125rem",
    fontWeight: 700,
  },
])

export const dialogHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.5rem 0.75rem 0.5rem 1.5rem",
})

export const dialogActions = style({
  display: "flex",
  alignItems: "center",
  gap: "0.625rem",
  flexWrap: "wrap",
  padding: "0.75rem 1.25rem 1.25rem",
  marginTop: "auto",
})

export const spacer = style({
  flexGrow: 1,
})

export const openDialogActions = style({
  display: "flex",
  flexDirection: "column",
  minWidth: "15.625rem",
  gap: "1rem",
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
  gap: "1.25rem",
  margin: "0.5rem 0 1rem",
})

export const numberInput = style({
  width: "5.5rem",
  textAlign: "center",
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
  padding: "0.625rem",
  borderTop: `0.0625rem solid ${vars.color.divider}`,
})
