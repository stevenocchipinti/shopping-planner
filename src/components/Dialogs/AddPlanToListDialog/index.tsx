import React, { useState } from "react"
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material"

import Dialog from "../Dialog"
import ShoppingLists from "../../ShoppingLists"
import { unslugify } from "../../../helpers"
import { useAppState } from "../../Backend"

interface AddPlanToListDialogProps {
  open: boolean
  onSubmit: (items: Array<{
    name: string
    section: string
    quantity: number
  }>) => void
  onClose: () => void
}

const AddPlanToListDialog = ({
  open,
  onSubmit,
  onClose,
}: AddPlanToListDialogProps) => {
  const { items, catalogue, recipes, planner } = useAppState()
  const [ignoredItems, setIgnoredItems] = useState<string[]>([])

  // Returns: ["apples", "pizza"]
  const plannerItems = Object.values(planner).flatMap(p => p.items)
  const plannedItemSlugs = [
    ...plannerItems
      ?.filter(i => i.type === "recipe")
      ?.flatMap(i => recipes[i.name]?.ingredients.map(i => i.slug))
      ?.filter(Boolean),
    ...plannerItems?.filter(i => i.type === "item")?.map(i => i.name),
  ]

  // Returns: {"apples": 2, "bananas": 1}
  const qtyBySlug = plannedItemSlugs.reduce(
    (result, slug) => ({
      ...result,
      [slug]: (result[slug] || 0) + 1,
    }),
    {} as Record<string, number>
  )

  const plannedItems = [...new Set(plannedItemSlugs)].map(slug => {
    const name = unslugify(slug)
    const existingItem = items.find(item => item.name === name)
    const existingQty =
      existingItem && !existingItem?.done ? existingItem?.quantity || 1 : 0
    const qtyToAdd = qtyBySlug[slug] || 1
    return {
      name,
      section: catalogue[slug]?.section || "",
      quantity: existingQty + qtyToAdd,
      done: ignoredItems.includes(unslugify(slug)),
    }
  })

  const itemsToAdd = plannedItems
    .filter(i => !i.done)
    .map(({ name, section, quantity }) => ({ name, section, quantity }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(itemsToAdd)
    onClose()
  }

  const handleMark = ({ name }: { name: string }) =>
    setIgnoredItems(
      ignoredItems.includes(name)
        ? ignoredItems.filter(i => i !== name)
        : [...ignoredItems, name]
    )

  return (
    <Dialog
      title="Add items"
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <DialogTitle>Add planner items to list</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can deselect any items you don't want.
        </DialogContentText>
        <ShoppingLists
          variant="embedded"
          items={plannedItems}
          onMark={handleMark}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={itemsToAdd.length === 0}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddPlanToListDialog
