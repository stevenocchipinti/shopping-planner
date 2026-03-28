import React, { useRef, useEffect, useState } from "react"
import {
  DialogActions,
  DialogContent,
  Button,
  IconButton,
  Typography,
} from "@mui/material"

import { Delete as DeleteIcon } from "@mui/icons-material"

import { useAppState } from "../../Backend"
import DayPicker from "../DayPicker"
import Dialog from "../Dialog"
import {
  ItemOrRecipeAutocomplete,
  IngredientAutocomplete,
} from "../../Autocomplete"
import { unslugify, slugify } from "../../../helpers"
import styled from "styled-components"

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 8px 24px;
`

interface PlannerItem {
  name: string
  day: string
  type: string
}

interface EditPlannerItemDialogProps {
  item: PlannerItem | undefined
  days: string[]
  open: boolean
  onSubmit: (entry: {
    item: PlannerItem
    newItem: string
    newDay: string
    newEmoji: string | null
    newIngredients: string[]
  }) => void
  onDelete: (entry: { item: string; day: string }) => void
  onClose: () => void
}

const EditPlannerItemDialog = ({
  item: itemToEdit,
  days,
  open,
  onSubmit,
  onDelete,
  onClose,
}: EditPlannerItemDialogProps) => {
  const { recipes, catalogue } = useAppState()
  const [item, setItem] = useState("")
  const [emoji, setEmoji] = useState<string | null>(null)
  const [ingredients, setIngredients] = useState<string[]>([])
  const [day, setDay] = useState(days[0])

  const itemInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!itemToEdit) return
    const { name, day: itemDay, type } = itemToEdit
    const emoji =
      type === "recipe" ? recipes[name]?.emoji : catalogue[name]?.emoji
    const ingredients = recipes[name]?.ingredients?.map(i => unslugify(i.slug))
    setItem(unslugify(name))
    setIngredients((type === "recipe" && ingredients) || [])
    setEmoji(emoji ?? null)
    setDay(itemDay)
  }, [itemToEdit, recipes, catalogue])

  const disabled = slugify(item) === ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    itemToEdit &&
      onSubmit({
        item: itemToEdit,
        newItem: item,
        newDay: day,
        newEmoji: emoji,
        newIngredients: ingredients,
      })
    onClose()
  }

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault()
    onDelete({ item, day })
    onClose()
  }

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
        <DayPicker days={days} value={day} onChange={setDay} />
        <ItemOrRecipeAutocomplete
          emoji={emoji}
          onEmojiChange={setEmoji}
          value={item}
          onChange={setItem}
          ref={itemInputRef}
          autoFocus
        />
        <IngredientAutocomplete value={ingredients} onChange={setIngredients} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={disabled}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditPlannerItemDialog
