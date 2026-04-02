import React, { useRef, useState } from "react"

import { normalizeSection, prettify } from "../../../helpers"
import { useAppState } from "../../Backend"
import { ItemAutocomplete, SectionAutocomplete } from "../../Autocomplete"
import Alert from "../../Alert"
import { Button } from "../../ui"
import { dialogActions, spacer } from "../../dialogs.css"
import {
  dialogBody,
  dialogDescription,
  dialogFooterGrow,
  dialogHeader,
  dialogTitle,
} from "../../ui.css"
import Dialog from "../Dialog"
import NumberPicker from "../NumberPicker"
import useDialogState from "./useDialogState"

interface AddItemDialogProps {
  open: boolean
  onSubmit: (entry: {
    item: string
    section: string
    quantity: number
    emoji: string | null
  }) => void
  onClose: () => void
}

const AddItemDialog = ({ open, onSubmit, onClose }: AddItemDialogProps) => {
  const { items, catalogue, isOnline } = useAppState()
  const [dialogState, dispatch] = useDialogState()
  const [alertVisible, setAlertVisible] = useState(false)
  const itemInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    onSubmit({
      item: prettify(dialogState.item),
      section: normalizeSection(dialogState.section),
      quantity: parseInt(dialogState.quantity.toString(), 10),
      emoji: dialogState.emoji,
    })
    setAlertVisible(true)
    setTimeout(() => setAlertVisible(false), 1000)
    dispatch({ type: "reset" })
    itemInputRef.current?.focus()
  }

  const updateItem = (newItem: string) =>
    dispatch({ type: "item", newItem, items, catalogue })
  const updateSection = (newSection: string) =>
    dispatch({ type: "section", newSection, items, catalogue })
  const updateQuantity = (newQuantity: number) =>
    dispatch({ type: "quantity", newQuantity, items, catalogue })
  const updateEmoji = (newEmoji: string | null) =>
    dispatch({ type: "emoji", newEmoji, items, catalogue })

  return (
    <Dialog open={open} onClose={onClose} onSubmit={handleSubmit} title="Add items">
      <div className={dialogHeader}>
        <h2 className={dialogTitle}>Add items</h2>
      </div>
      <div className={dialogBody}>
        <ItemAutocomplete
          value={dialogState.item}
          onChange={updateItem}
          emoji={dialogState.emoji}
          onEmojiChange={updateEmoji}
          ref={itemInputRef}
          autoFocus
        />
        <SectionAutocomplete value={dialogState.section} onChange={updateSection} />
        <NumberPicker value={dialogState.quantity} onChange={updateQuantity} />
        {!isOnline ? (
          <p className={dialogDescription}>
            You are offline. Changes save on this device and will sync when you reconnect.
          </p>
        ) : null}
      </div>
      <div className={dialogActions}>
        <Alert visible={alertVisible}>Saved!</Alert>
        <span className={dialogFooterGrow} />
        <Button onClick={onClose}>Close</Button>
        <Button
          type="submit"
          variant="solid"
          disabled={dialogState.actionDisabled}
        >
          {dialogState.actionLabel}
        </Button>
      </div>
    </Dialog>
  )
}

export default AddItemDialog
