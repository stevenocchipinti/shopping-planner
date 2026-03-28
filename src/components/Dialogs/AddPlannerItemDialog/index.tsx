import React, { useRef, useState } from "react"
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material"
import Alert from "../../Alert"
import DayPicker from "../DayPicker"
import Dialog from "../Dialog"
import {
  ItemOrRecipeAutocomplete,
  IngredientAutocomplete,
} from "../../Autocomplete"
import { slugify, unslugify } from "../../../helpers"
import styled from "styled-components"
import { useAppState } from "../../Backend"

const Spacer = styled.div`
  flex-grow: 1;
`

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
  const alreadyPlanned = plannedItems.some(i => i.name === slugify(item))
  const disabled = slugify(item) === "" || alreadyPlanned

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      day: day!,
      name: item,
      ingredients,
      emoji,
    })
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
    if (recipe) setIngredients(recipe.ingredients.map(i => unslugify(i.slug)))
  }

  return (
    <Dialog
      title="Add items"
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <DialogTitle>Add items to planner</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Alert visible={alertVisible}>Saved!</Alert>
        <Spacer />
        <Button onClick={onClose}>Close</Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={disabled}
        >
          {alreadyPlanned ? "Already exists!" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddPlannerItemDialog
