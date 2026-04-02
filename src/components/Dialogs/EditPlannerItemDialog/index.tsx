import React, { useEffect, useRef, useState } from "react"
import { Trash2 } from "lucide-react"

import { slugify, unslugify } from "../../../helpers"
import { useAppState } from "../../Backend"
import {
  IngredientAutocomplete,
  ItemOrRecipeAutocomplete,
} from "../../Autocomplete"
import { Button, IconButton } from "../../ui"
import { dialogActions, dialogHeader } from "../../dialogs.css"
import { dialogBody, dialogDescription, dialogFooterGrow, dialogTitle } from "../../ui.css"
import DayPicker from "../DayPicker"
import Dialog from "../Dialog"

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
  const { recipes, catalogue, isOnline } = useAppState()
  const [item, setItem] = useState("")
  const [emoji, setEmoji] = useState<string | null>(null)
  const [ingredients, setIngredients] = useState<string[]>([])
  const [day, setDay] = useState(days[0])

  const itemInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!itemToEdit) return

    const { name, day: itemDay, type } = itemToEdit
    const itemEmoji = type === "recipe" ? recipes[name]?.emoji : catalogue[name]?.emoji
    const recipeIngredients = recipes[name]?.ingredients?.map(ingredient => unslugify(ingredient.slug))

    setItem(unslugify(name))
    setIngredients((type === "recipe" && recipeIngredients) || [])
    setEmoji(itemEmoji ?? null)
    setDay(itemDay)
  }, [itemToEdit, recipes, catalogue])

  const disabled = slugify(item) === ""

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (itemToEdit) {
      onSubmit({
        item: itemToEdit,
        newItem: item,
        newDay: day,
        newEmoji: emoji,
        newIngredients: ingredients,
      })
    }
    onClose()
  }

  const handleDelete = (event: React.FormEvent) => {
    event.preventDefault()
    onDelete({ item, day })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} onSubmit={handleSubmit} title="Edit item">
      <div className={dialogHeader}>
        <h2 className={dialogTitle}>Edit item</h2>
        <IconButton onClick={handleDelete} aria-label="Delete planner item">
          <Trash2 size={18} />
        </IconButton>
      </div>
      <div className={dialogBody}>
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
        {!isOnline ? (
          <p className={dialogDescription}>
            You are offline. Planner changes save on this device and will sync when you reconnect.
          </p>
        ) : null}
      </div>
      <div className={dialogActions}>
        <span className={dialogFooterGrow} />
        <Button onClick={onClose}>Close</Button>
        <Button type="submit" variant="solid" disabled={disabled}>
          Save
        </Button>
      </div>
    </Dialog>
  )
}

export default EditPlannerItemDialog
