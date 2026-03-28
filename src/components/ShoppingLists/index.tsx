import React, { useState, FC } from "react"
import styled from "styled-components"

import Placeholder from "./Placeholder"
import Chip from "../Chip"
import { slugify } from "../../helpers"
import { EditItemDialog } from "../Dialogs"
import { useAppState } from "../Backend"
import { ShoppingItem, CatalogueEntry } from "../Backend/backend"

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

const Container = styled.div<{ variant?: string }>`
  padding: ${({ variant }) =>
    variant === "embedded" ? "0 0 16px" : "4px 16px 120px"};
  margin: 0 auto;
  max-width: 720px;
`

const Section = styled.div`
  margin: 0 0 4px;
  padding: 0;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
    padding-top: 4px;
  }
`

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 4px 0 8px;
`

const SectionTitle = styled.h2`
  font-size: 11px;
  margin: 12px 0 4px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.text.secondary};
`

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

  const itemsBySection = items.reduce<ItemsBySection>((a, item) => {
    const catalogueEntry = catalogue[slugify(item.name)] as CatalogueEntry | undefined
    const section = catalogueEntry?.section || ""
    return {
      ...a,
      [section]: [
        ...(a[section] || []),
        { ...item, emoji: catalogueEntry?.emoji },
      ],
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
      <Container variant={variant}>
        {sections.map((section, index) => (
          <Section key={index}>
            {section && <SectionTitle>{section}</SectionTitle>}
            <Items>{renderItemsFor(itemsBySection[section])}</Items>
          </Section>
        ))}

        {!loading && sections.length === 0 && <Placeholder />}
      </Container>

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
