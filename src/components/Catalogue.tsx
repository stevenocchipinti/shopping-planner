import React, { FC, useMemo, useState } from "react"
import { Package, Trash2 } from "lucide-react"

import { normalizeSection, slugify, unslugify } from "../helpers"
import { useAppState, useBackend } from "./Backend"
import { Emoji } from "./Emoji"
import { EditItemDialog } from "./Dialogs"
import {
  headerSummaryCard,
  headerSummaryGrid,
  headerSummaryMeta,
  headerSummaryMetaSplit,
  headerSummaryTitle,
  historyRowAction,
  itemCell,
  itemCellContent,
  itemCellEmoji,
  itemCellLabel,
  placeholderRow,
  table,
  tableCard,
  tableCell,
  tableCellRight,
  tableCellStrong,
  tableHeadCell,
  tableRowLast,
  tableWrapper,
  tableWrapperEmbedded,
} from "./listing.css"
import { Button, IconButton } from "./ui"

interface CatalogueProps {
  onDelete: (item: string) => void
  embedded?: boolean
}

const Catalogue: FC<CatalogueProps> = ({ onDelete, embedded = false }) => {
  const { catalogue, loading } = useAppState()
  const backend = useBackend()
  const entries = Object.keys(catalogue)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<string | undefined>(undefined)
  const itemCount = entries.length
  const sectionCount = useMemo(
    () => new Set(entries.map(item => normalizeSection(catalogue[item].section || "")).filter(Boolean)).size,
    [catalogue, entries]
  )
  const itemRecord = useMemo(() => {
    if (!itemToEdit) return undefined

    const slug = slugify(itemToEdit)
    return {
      name: unslugify(slug),
      quantity: 1,
      done: false,
      emoji: catalogue[slug]?.emoji ?? null,
    }
  }, [catalogue, itemToEdit])

  return (
    <>
      <div className={embedded ? tableWrapperEmbedded : tableWrapper}>
      <div className={headerSummaryCard}>
        <div className={headerSummaryGrid}>
          <strong className={headerSummaryTitle}>Saved sections</strong>
          <span className={`${headerSummaryMeta} ${headerSummaryMetaSplit}`}>{sectionCount}</span>
          <strong className={headerSummaryTitle}>Saved items</strong>
          <span className={`${headerSummaryMeta} ${headerSummaryMetaSplit}`}>{itemCount}</span>
        </div>
      </div>

      <div className={tableCard}>
        <table className={table} aria-label="History table">
          <thead>
            <tr>
              <th className={tableHeadCell}>Item</th>
              <th className={tableHeadCell}>Section</th>
              <th className={`${tableHeadCell} ${tableCellRight}`}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {!loading && entries.length === 0 ? (
              <tr>
                <th className={placeholderRow} colSpan={3} scope="row">
                  No history yet
                </th>
              </tr>
            ) : null}

            {entries.map((item, index) => (
              <tr key={item} className={index === entries.length - 1 ? tableRowLast : undefined}>
                <th className={`${tableCell} ${tableCellStrong} ${itemCell}`} scope="row">
                  <Button
                    className={historyRowAction}
                    variant="ghost"
                    onClick={() => {
                      setItemToEdit(item)
                      setEditDialogOpen(true)
                    }}
                  >
                    <span className={itemCellContent}>
                    <span className={itemCellEmoji}>
                      {catalogue[item].emoji ? (
                        <Emoji emoji={catalogue[item].emoji} size={18} />
                      ) : (
                        <Package size={16} />
                      )}
                    </span>
                    <span className={itemCellLabel}>{unslugify(item)}</span>
                    </span>
                  </Button>
                </th>
                <td className={tableCell}>
                  <Button
                    className={historyRowAction}
                    variant="ghost"
                    onClick={() => {
                      setItemToEdit(item)
                      setEditDialogOpen(true)
                    }}
                  >
                    {normalizeSection(catalogue[item].section || "")}
                  </Button>
                </td>
                <td className={`${tableCell} ${tableCellRight}`}>
                  <IconButton onClick={() => onDelete(item)} aria-label={`Delete ${unslugify(item)}`}>
                    <Trash2 size={18} />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <EditItemDialog
        item={itemRecord}
        open={editDialogOpen}
        onSubmit={({ newItem, newSection, newEmoji }) => {
          if (!itemToEdit) return
          backend.handleCatalogueEdit({
            item: itemToEdit,
            newItem,
            newSection,
            newEmoji,
          })
        }}
        onDelete={() => {
          if (!itemToEdit) return
          onDelete(itemToEdit)
        }}
        title="Edit saved item"
        onClose={() => setEditDialogOpen(false)}
      />
    </>
  )
}

export default Catalogue
