import React, { useEffect } from "react"
import styled from "styled-components"
import {
  DialogActions,
  DialogContent,
  Button,
  IconButton,
  Typography,
} from "@mui/material"
import { Delete as DeleteIcon } from "@mui/icons-material"

import Dialog from "../Dialog"
import { ItemAutocomplete, SectionAutocomplete } from "../../Autocomplete"
import NumberPicker from "../NumberPicker"
import { prettify } from "../../../helpers"
import { useDialogState } from "./useDialogState"
import { useAppState } from "../../Backend"
import { ShoppingItem } from "../../Backend/backend"

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 8px 24px;
`

const SubmitButton = styled(Button)`
  && {
    color: ${({ theme }) => theme.palette.primary.contrastText};
  }
`

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
    item && dispatch({ type: "set", item, items, catalogue })
  }, [dispatch, item, items, catalogue, open])

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault()
    item && onDelete(item)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    item &&
      onSubmit({
        item,
        newItem: prettify(dialogState.item),
        newSection: prettify(dialogState.section),
        newQuantity: parseInt(dialogState.quantity.toString()),
        newEmoji: dialogState.emoji,
      })
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
    <Dialog
      title="Edit item"
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <DialogHeader>
        <Typography component="h2" variant="h6">
          Edit item
        </Typography>
        <IconButton
          onClick={handleDelete}
          color="inherit"
          edge="start"
          aria-label="menu"
        >
          <DeleteIcon />
        </IconButton>
      </DialogHeader>
      <DialogContent>
        <ItemAutocomplete
          value={dialogState.item}
          onChange={updateItem}
          emoji={dialogState.emoji}
          onEmojiChange={updateEmoji}
          autoFocus
        />
        <SectionAutocomplete
          value={dialogState.section}
          onChange={updateSection}
        />
        <NumberPicker value={dialogState.quantity} onChange={updateQuantity} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <SubmitButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={dialogState.actionDisabled}
        >
          {dialogState.actionLabel}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  )
}

export default EditItemDialog
