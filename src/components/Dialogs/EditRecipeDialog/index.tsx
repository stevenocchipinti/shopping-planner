import React, { useEffect, useRef, useState } from "react"
import { Trash2 } from "lucide-react"

import { slugify, unslugify } from "../../../helpers"
import { useAppState } from "../../Backend"
import { IngredientAutocomplete, ItemOrRecipeAutocomplete } from "../../Autocomplete"
import { Button, IconButton } from "../../ui"
import { dialogActions, dialogHeader } from "../../dialogs.css"
import { dialogBody, dialogDescription, dialogFooterGrow, dialogTitle } from "../../ui.css"
import Dialog from "../Dialog"

interface EditRecipeDialogProps {
  item: string | undefined
  open: boolean
  onSubmit: (entry: {
    item: string
    newItem: string
    newEmoji: string | null
    newIngredients: string[]
  }) => void
  onDelete: (item: string) => void
  onClose: () => void
}

const EditRecipeDialog = ({ item, open, onSubmit, onDelete, onClose }: EditRecipeDialogProps) => {
  const { recipes, isOnline } = useAppState()
  const [recipeName, setRecipeName] = useState("")
  const [emoji, setEmoji] = useState<string | null>(null)
  const [ingredients, setIngredients] = useState<string[]>([])
  const itemInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!item) return

    const recipe = recipes[item]
    setRecipeName(recipe?.title || unslugify(item))
    setEmoji(recipe?.emoji ?? null)
    setIngredients(recipe?.ingredients?.map(ingredient => unslugify(ingredient.slug)) || [])
  }, [item, recipes])

  const disabled = slugify(recipeName) === ""

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!item) return

    onSubmit({
      item,
      newItem: recipeName,
      newEmoji: emoji,
      newIngredients: ingredients,
    })
    onClose()
  }

  const handleDelete = (event: React.FormEvent) => {
    event.preventDefault()
    if (!item) return
    onDelete(item)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} onSubmit={handleSubmit} title="Edit recipe">
      <div className={dialogHeader}>
        <h2 className={dialogTitle}>Edit recipe</h2>
        <IconButton onClick={handleDelete} aria-label="Delete recipe">
          <Trash2 size={18} />
        </IconButton>
      </div>
      <div className={dialogBody}>
        <ItemOrRecipeAutocomplete
          emoji={emoji}
          onEmojiChange={setEmoji}
          value={recipeName}
          onChange={setRecipeName}
          ref={itemInputRef}
          autoFocus
        />
        <IngredientAutocomplete value={ingredients} onChange={setIngredients} />
        {!isOnline ? (
          <p className={dialogDescription}>
            You are offline. Recipe changes save on this device and will sync when you reconnect.
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

export default EditRecipeDialog
