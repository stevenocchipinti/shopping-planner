import React, { FC, ReactNode } from "react"
import { CheckCircle2, CircleAlert, CircleX, Info } from "lucide-react"

import { alert } from "./dialogs.css"

interface AlertProps {
  children: ReactNode
  visible?: boolean
  severity?: "success" | "info" | "warning" | "error"
}

const icons = {
  success: <CheckCircle2 size={14} />,
  info: <Info size={14} />,
  warning: <CircleAlert size={14} />,
  error: <CircleX size={14} />,
}

const Alert: FC<AlertProps> = ({
  children,
  visible = true,
  severity = "success",
}) => (
  <div className={alert} data-visible={visible} aria-live="polite">
    {icons[severity]}
    <span>{children}</span>
  </div>
)

export default Alert
