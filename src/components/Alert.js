import React from "react"
import { Alert as MuiAlert, Fade } from "@mui/material"

const Alert = ({ children, visible = true, severity = "success" }) => (
  <Fade in={visible}>
    <MuiAlert severity={severity}>{children}</MuiAlert>
  </Fade>
)

export default Alert
