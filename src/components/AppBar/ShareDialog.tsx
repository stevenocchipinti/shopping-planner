import React, { FC } from "react"

import Dialog from "../Dialogs/Dialog"
import { Button, TextField } from "../ui"
import { field, fieldLabel } from "../ui.css"
import { dialogActions } from "../dialogs.css"
import {
  dialogBody,
  dialogFooterGrow,
  dialogHeader,
  dialogTitle,
} from "../ui.css"
import {
  warningCallout,
  warningCalloutLabel,
  warningCalloutText,
} from "../app-shell.css"

interface ShareDialogProps {
  open: boolean
  onClose: () => void
}

const ShareDialog: FC<ShareDialogProps> = ({ open, onClose }) => {
  const share = () => {
    if (navigator.share !== undefined) {
      navigator
        .share({
          title: "My shopping planner",
          url: window.location.href,
        })
        .then(onClose)
        .catch(console.error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div className={dialogHeader}>
        <h2 className={dialogTitle}>Share Live List URL</h2>
      </div>
      <div className={dialogBody}>
        <div className={warningCallout}>
          <span className={warningCalloutLabel}>Warning</span>
          <p className={warningCalloutText}>
            Anyone who has this URL will be able to view and modify this list.
          </p>
        </div>
        <label className={field}>
          <span className={fieldLabel}>Share URL</span>
          <TextField
            readOnly
            value={window.location.href}
            onFocus={event => event.currentTarget.select()}
            aria-label="Share list URL"
          />
        </label>
      </div>
      <div className={dialogActions}>
        <span className={dialogFooterGrow} />
        <Button onClick={onClose}>Done</Button>
        {navigator.share !== undefined ? (
          <Button variant="solid" onClick={share}>
            Share
          </Button>
        ) : null}
      </div>
    </Dialog>
  )
}

export default ShareDialog
