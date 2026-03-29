import React, { useRef, useState } from "react"

import { slugify, unslugify } from "../../../helpers"
import { useAppState } from "../../Backend"
import {
  IngredientAutocomplete,
  ItemOrRecipeAutocomplete,
} from "../../Autocomplete"
import Alert from "../../Alert"
import { Button } from "../../ui"
import { dialogActions } from "../../dialogs.css"
import { dialogBody, dialogFooterGrow, dialogHeader, dialogTitle } from "../../ui.css"
import DayPicker from "../DayPicker"
import Dialog from "../Dialog"

interface AddPlannerItemDialogProps {
  day: string | null
  days: string[]
  open: boolean
  onSubmit: (entry: {
    day: string
    name: string
    ingredients: string[]
    emoji: string | null
  }) => void
  onClose: () => void
  onChangeDay: (day: string) => void
}

const AddPlannerItemDialog = ({
  day,
  days,
  open,
  onSubmit,
  onClose,
  onChangeDay,
}: AddPlannerItemDialogProps) => {
  const { recipes, planner } = useAppState()
  const [item, setItem] = useState("")
  const [emoji, setEmoji] = useState<string | null>(null)
  const [ingredients, setIngredients] = useState<string[]>([])
  const [alertVisible, setAlertVisible] = useState(false)

  const itemInputRef = useRef<HTMLInputElement>(null)

  const plannedItems = planner[day!]?.items || []
  const alreadyPlanned = plannedItems.some(entry => entry.name === slugify(item))
  const disabled = slugify(item) === "" || alreadyPlanned

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({ day: day!, name: item, ingredients, emoji })
    setAlertVisible(true)
    setTimeout(() => setAlertVisible(false), 1000)
    setItem("")
    setEmoji(null)
    setIngredients([])
    itemInputRef.current?.focus()
  }

  const updateItem = (newItem: string) => {
    setItem(newItem)
    const recipe = recipes[slugify(newItem)]
    if (recipe) setIngredients(recipe.ingredients.map(ingredient => unslugify(ingredient.slug)))
  }

  return (
    <Dialog open={open} onClose={onClose} onSubmit={handleSubmit} title="Add items">
      <div className={dialogHeader}>
        <h2 className={dialogTitle}>Add items to planner</h2>
      </div>
      <div className={dialogBody}>
        <DayPicker days={days} value={day} onChange={onChangeDay} />
        <ItemOrRecipeAutocomplete
          emoji={emoji}
          onEmojiChange={setEmoji}
          value={item}
          onChange={updateItem}
          ref={itemInputRef}
          autoFocus
        />
        <IngredientAutocomplete value={ingredients} onChange={setIngredients} />
      </div>
      <div className={dialogActions}>
        <Alert visible={alertVisible}>Saved!</Alert>
        <span className={dialogFooterGrow} />
        <Button onClick={onClose}>Close</Button>
        <Button type="submit" variant="solid" disabled={disabled}>
          {alreadyPlanned ? "Already exists!" : "Save"}
        </Button>
      </div>
    </Dialog>
  )
}

export default AddPlannerItemDialog
