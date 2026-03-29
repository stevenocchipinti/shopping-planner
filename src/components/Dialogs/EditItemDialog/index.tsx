import React, { useEffect } from "react"
import { Trash2 } from "lucide-react"

import { normalizeSection, prettify } from "../../../helpers"
import { ShoppingItem } from "../../Backend/backend"
import { useAppState } from "../../Backend"
import { ItemAutocomplete, SectionAutocomplete } from "../../Autocomplete"
import { Button, IconButton } from "../../ui"
import { dialogActions, dialogHeader } from "../../dialogs.css"
import { dialogBody, dialogFooterGrow, dialogTitle } from "../../ui.css"
import Dialog from "../Dialog"
import NumberPicker from "../NumberPicker"
import { useDialogState } from "./useDialogState"

interface EditItemDialogProps {
  item: ShoppingItem | undefined
  open: boolean
  onSubmit: (entry: {
    item: ShoppingItem
    newItem: string
    newSection: string
    newQuantity: number
    newEmoji: string | null
  }) => void
  onDelete: (item: ShoppingItem) => void
  onClose: () => void
}

const EditItemDialog = ({
  item,
  open,
  onSubmit,
  onDelete,
  onClose,
}: EditItemDialogProps) => {
  const { items, catalogue } = useAppState()
  const [dialogState, dispatch] = useDialogState()

  useEffect(() => {
    if (item) dispatch({ type: "set", item, items, catalogue })
  }, [dispatch, item, items, catalogue, open])

  const handleDelete = (event: React.FormEvent) => {
    event.preventDefault()
    if (item) onDelete(item)
    onClose()
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (item) {
      onSubmit({
        item,
        newItem: prettify(dialogState.item),
        newSection: normalizeSection(dialogState.section),
        newQuantity: parseInt(dialogState.quantity.toString(), 10),
        newEmoji: dialogState.emoji,
      })
    }
    onClose()
  }

  const updateItem = (newItem: string) =>
    dispatch({ type: "item", newItem, item, items, catalogue })
  const updateSection = (newSection: string) =>
    dispatch({ type: "section", newSection, item, items, catalogue })
  const updateQuantity = (newQuantity: number) =>
    dispatch({ type: "quantity", newQuantity, item, items, catalogue })
  const updateEmoji = (newEmoji: string | null) =>
    dispatch({ type: "emoji", newEmoji, item, items, catalogue })

  return (
    <Dialog open={open} onClose={onClose} onSubmit={handleSubmit} title="Edit item">
      <div className={dialogHeader}>
        <h2 className={dialogTitle}>Edit item</h2>
        <IconButton onClick={handleDelete} aria-label="Delete item">
          <Trash2 size={18} />
        </IconButton>
      </div>
      <div className={dialogBody}>
        <ItemAutocomplete
          value={dialogState.item}
          onChange={updateItem}
          emoji={dialogState.emoji}
          onEmojiChange={updateEmoji}
          autoFocus
        />
        <SectionAutocomplete value={dialogState.section} onChange={updateSection} />
        <NumberPicker value={dialogState.quantity} onChange={updateQuantity} />
      </div>
      <div className={dialogActions}>
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

export default EditItemDialog
