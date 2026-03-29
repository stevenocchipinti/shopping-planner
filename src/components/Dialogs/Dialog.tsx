import React from "react"

import { Dialog as BaseDialog } from "../ui"

interface DialogProps {
  open: boolean
  onClose: () => void
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
  title?: string
}

const Dialog = ({ onSubmit, children, ...props }: DialogProps) => (
  <BaseDialog onSubmit={onSubmit} {...props}>
    {children}
  </BaseDialog>
)

export default Dialog
