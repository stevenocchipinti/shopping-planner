import React, { FC, useState } from "react"

import { normalizeSection, slugify } from "../../helpers"
import { CatalogueEntry, ShoppingItem } from "../Backend/backend"
import { useAppState } from "../Backend"
import Chip from "../Chip"
import { EditItemDialog } from "../Dialogs"
import Placeholder from "./Placeholder"
import {
  shoppingContainer,
  shoppingContainerEmbedded,
  shoppingItems,
  shoppingSection,
  shoppingSectionTitle,
} from "../listing.css"
import { cx } from "../ui"

interface EditItemEntry {
  item: ShoppingItem
  newItem: string
  newSection: string
  newQuantity: number
  newEmoji: string | null
}

interface ShoppingListsProps {
  onMark: (item: ShoppingItem) => void
  onEdit?: (entry: EditItemEntry) => void
  onDelete?: (item: ShoppingItem) => void
  items: ShoppingItem[]
  variant?: "main" | "embedded"
}

interface ItemWithEmoji extends ShoppingItem {
  emoji?: string | null
}

interface ItemsBySection {
  [key: string]: ItemWithEmoji[]
}

const ShoppingLists: FC<ShoppingListsProps> = ({
  onMark,
  onEdit,
  onDelete,
  items,
  variant = "main",
}) => {
  const { catalogue, loading } = useAppState()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<ShoppingItem | undefined>(undefined)

  const handleEdit = (item: ShoppingItem) => {
    if (onEdit) {
      setItemToEdit(item)
      setEditDialogOpen(true)
    }
  }

  const renderItemsFor = (section: ItemWithEmoji[]) => {
    const notDone = section.filter(i => !i.done).sort((a, b) => a.name.localeCompare(b.name))
    const done = section.filter(i => i.done).sort((a, b) => a.name.localeCompare(b.name))

    return notDone.concat(done).map((item, index) => (
      <Chip
        key={index}
        onClick={() => onMark(item)}
        onLongPress={() => handleEdit(item)}
        qty={item.quantity}
        done={item.done}
        emoji={item.emoji}
      >
        {item.name}
      </Chip>
    ))
  }

  const itemsBySection = items.reduce<ItemsBySection>((acc, item) => {
    const catalogueEntry = catalogue[slugify(item.name)] as CatalogueEntry | undefined
    const section = normalizeSection(catalogueEntry?.section || "")

    return {
      ...acc,
      [section]: [...(acc[section] || []), { ...item, emoji: catalogueEntry?.emoji }],
    }
  }, {})

  const notDone = Object.keys(itemsBySection)
    .filter(section => itemsBySection[section].some(item => !item.done))
    .sort()
  const done = Object.keys(itemsBySection)
    .filter(section => itemsBySection[section].every(item => item.done))
    .sort()

  const sections = [...notDone, ...done]

  return (
    <>
      <div className={cx(shoppingContainer, variant === "embedded" && shoppingContainerEmbedded)}>
        {sections.map((section, index) => (
          <section className={shoppingSection} key={index}>
            {section ? <h2 className={shoppingSectionTitle}>{section}</h2> : null}
            <div className={shoppingItems}>{renderItemsFor(itemsBySection[section])}</div>
          </section>
        ))}

        {!loading && sections.length === 0 ? <Placeholder /> : null}
      </div>

      <EditItemDialog
        item={itemToEdit}
        open={editDialogOpen}
        onSubmit={onEdit!}
        onDelete={onDelete!}
        onClose={() => setEditDialogOpen(false)}
      />
    </>
  )
}

export default ShoppingLists
