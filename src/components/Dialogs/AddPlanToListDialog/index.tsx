import React, { useState } from "react"

import { unslugify } from "../../../helpers"
import { useAppState } from "../../Backend"
import ShoppingLists from "../../ShoppingLists"
import { Button } from "../../ui"
import { dialogActions } from "../../dialogs.css"
import {
  dialogBody,
  dialogDescription,
  dialogFooterGrow,
  dialogHeader,
  dialogTitle,
} from "../../ui.css"
import Dialog from "../Dialog"

interface AddPlanToListDialogProps {
  open: boolean
  onSubmit: (items: Array<{
    name: string
    section: string
    quantity: number
  }>) => void
  onClose: () => void
}

const AddPlanToListDialog = ({ open, onSubmit, onClose }: AddPlanToListDialogProps) => {
  const { items, catalogue, recipes, planner, isOnline } = useAppState()
  const [ignoredItems, setIgnoredItems] = useState<string[]>([])

  const plannerItems = Object.values(planner).flatMap(day => day.items)
  const plannedItemSlugs = [
    ...plannerItems
      .filter(item => item.type === "recipe")
      .flatMap(item => recipes[item.name]?.ingredients.map(ingredient => ingredient.slug))
      .filter(Boolean),
    ...plannerItems.filter(item => item.type === "item").map(item => item.name),
  ]

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
    const existingQty = existingItem && !existingItem.done ? existingItem.quantity || 1 : 0
    const qtyToAdd = qtyBySlug[slug] || 1

    return {
      name,
      section: catalogue[slug]?.section || "",
      quantity: existingQty + qtyToAdd,
      done: ignoredItems.includes(unslugify(slug)),
    }
  })

  const itemsToAdd = plannedItems
    .filter(item => !item.done)
    .map(({ name, section, quantity }) => ({ name, section, quantity }))

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit(itemsToAdd)
    onClose()
  }

  const handleMark = ({ name }: { name: string }) =>
    setIgnoredItems(
      ignoredItems.includes(name)
        ? ignoredItems.filter(item => item !== name)
        : [...ignoredItems, name]
    )

  return (
    <Dialog open={open} onClose={onClose} onSubmit={handleSubmit} title="Add items">
      <div className={dialogHeader}>
        <h2 className={dialogTitle}>Add planner items to list</h2>
      </div>
      <div className={dialogBody}>
        <p className={dialogDescription}>
          {!isOnline
            ? "You are offline. Any list updates you confirm here will save on this device and sync when you reconnect."
            : "You can deselect any items you don't want."}
        </p>
        <ShoppingLists variant="embedded" items={plannedItems} onMark={handleMark} />
      </div>
      <div className={dialogActions}>
        <span className={dialogFooterGrow} />
        <Button onClick={onClose}>Close</Button>
        <Button type="submit" variant="solid" disabled={itemsToAdd.length === 0}>
          Add
        </Button>
      </div>
    </Dialog>
  )
}

export default AddPlanToListDialog
