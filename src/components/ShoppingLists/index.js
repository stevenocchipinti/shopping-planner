import React, { useState } from "react"
import styled from "styled-components"

import Placeholder from "./Placeholder"
import Chip from "../Chip"
import { slugify } from "../../helpers"
import { EditItemDialog } from "../Dialogs"
import { useAppState } from "../Backend"

const Container = styled.div`
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

const ShoppingLists = ({
  onMark,
  onEdit,
  onDelete,
  items, // Not always from the AppState
  variant = "main",
}) => {
  const { catalogue, loading } = useAppState()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState()

  const handleEdit = item => {
    if (onEdit) {
      setItemToEdit(item)
      setEditDialogOpen(true)
    }
  }

  const renderItemsFor = section => {
    const notDone = section.filter(i => !i.done).sort()
    const done = section.filter(i => i.done).sort()
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

  const itemsBySection = items.reduce((a, item) => {
    const catalogueEntry = catalogue[slugify(item.name)]
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
        onSubmit={onEdit}
        onDelete={onDelete}
        onClose={() => setEditDialogOpen(false)}
        items={items}
        catalogue={catalogue}
      />
    </>
  )
}

export default ShoppingLists
