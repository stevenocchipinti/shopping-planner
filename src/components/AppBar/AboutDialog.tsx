import React, { FC } from "react"

import Dialog from "../Dialogs/Dialog"
import { Button } from "../ui"
import {
  dialogBody,
  dialogDescription,
  dialogFooter,
  dialogHeader,
  dialogTitle,
} from "../ui.css"

interface AboutDialogProps {
  open: boolean
  onClose: () => void
}

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
)

const AboutDialog: FC<AboutDialogProps> = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <div className={dialogHeader}>
      <h2 className={dialogTitle}>About</h2>
    </div>
    <div className={dialogBody}>
      <p className={dialogDescription}>
        A side project by <ExternalLink href="https://stevenocchipinti.com">Steve Occhipinti</ExternalLink>.
      </p>
      <p className={dialogDescription}>
        Custom emojis, bug reports and other contributions welcome on the{" "}
        <ExternalLink href="https://github.com/stevenocchipinti/shopping-list">
          github page
        </ExternalLink>
        .
      </p>
      <p className={dialogDescription}>
        Custom icons provided for free by <ExternalLink href="https://icons8.com">Icons8</ExternalLink>.
      </p>
    </div>
    <div className={dialogFooter}>
      <Button onClick={onClose}>Done</Button>
    </div>
  </Dialog>
)

export default AboutDialog
