import React, { ReactNode, FC } from "react"
import { Alert as MuiAlert, Fade } from "@mui/material"

interface AlertProps {
  children: ReactNode
  visible?: boolean
  severity?: "success" | "info" | "warning" | "error"
}

const Alert: FC<AlertProps> = ({ children, visible = true, severity = "success" }) => (
  <Fade in={visible}>
    <MuiAlert severity={severity}>{children}</MuiAlert>
  </Fade>
)

export default Alert
