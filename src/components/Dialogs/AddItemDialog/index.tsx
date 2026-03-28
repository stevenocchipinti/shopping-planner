import React, { useRef, useState } from "react"
import styled from "styled-components"
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material"
import Alert from "../../Alert"
import Dialog from "../Dialog"
import { ItemAutocomplete, SectionAutocomplete } from "../../Autocomplete"
import NumberPicker from "../NumberPicker"
import useDialogState from "./useDialogState"
import { normalizeSection, prettify } from "../../../helpers"
import { useAppState } from "../../Backend"

const Spacer = styled.div`
  flex-grow: 1;
`

const Actions = styled(DialogActions)`
  && {
    align-items: center;
  }
`

const SubmitButton = styled(Button)`
  && {
    color: ${({ theme }) => theme.palette.primary.contrastText};
  }
`

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

const AddItemDialog = ({
  open,
  onSubmit,
  onClose,
}: AddItemDialogProps) => {
  const { items, catalogue } = useAppState()
  const [dialogState, dispatch] = useDialogState()
  const [alertVisible, setAlertVisible] = useState(false)
  const itemInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      item: prettify(dialogState.item),
      section: normalizeSection(dialogState.section),
      quantity: parseInt(dialogState.quantity.toString()),
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
    <Dialog
      title="Add items"
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <DialogTitle>Add items</DialogTitle>
      <DialogContent>
        <ItemAutocomplete
          value={dialogState.item}
          onChange={updateItem}
          emoji={dialogState.emoji}
          onEmojiChange={updateEmoji}
          ref={itemInputRef}
          autoFocus
        />
        <SectionAutocomplete
          value={dialogState.section}
          onChange={updateSection}
        />
        <NumberPicker value={dialogState.quantity} onChange={updateQuantity} />
      </DialogContent>
      <Actions>
        <Alert visible={alertVisible}>Saved!</Alert>
        <Spacer />
        <Button onClick={onClose}>Close</Button>
        <SubmitButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={dialogState.actionDisabled}
        >
          {dialogState.actionLabel}
        </SubmitButton>
      </Actions>
    </Dialog>
  )
}

export default AddItemDialog
