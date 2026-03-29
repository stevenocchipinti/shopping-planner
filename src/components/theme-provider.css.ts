import { style } from "@vanilla-extract/css"

import { vars } from "../theme.css"
import { segmentedButton, segmentedControl } from "./ui.css"

export const toggleCard = style({
  marginTop: "auto",
  padding: 16,
})

export const toggleLabel = style({
  margin: "0 0 10px",
  color: vars.color.textMuted,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
})

export const toggleGroup = style([
  segmentedControl,
  {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
])

export const toggleButton = style([
  segmentedButton,
  {
    minWidth: 0,
  },
])
