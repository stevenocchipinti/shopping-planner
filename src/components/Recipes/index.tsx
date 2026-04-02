import React, { FC, useState } from "react"
import { ChefHat, Trash2 } from "lucide-react"

import { unslugify } from "../../helpers"
import { useAppState, useBackend } from "../Backend"
import { EditRecipeDialog } from "../Dialogs"
import { Emoji } from "../Emoji"
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
  recipeIngredients,
  table,
  tableCard,
  tableCell,
  tableCellRight,
  tableCellStrong,
  tableHeadCell,
  tableRowLast,
  tableWrapper,
  tableWrapperEmbedded,
} from "../listing.css"
import { Button, IconButton } from "../ui"

interface RecipesProps {
  embedded?: boolean
}

const Recipes: FC<RecipesProps> = ({ embedded = false }) => {
  const { recipes, loading } = useAppState()
  const backend = useBackend()
  const recipeEntries = Object.entries(recipes)
  const [recipeToEdit, setRecipeToEdit] = useState<string | undefined>(undefined)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return (
    <>
      <div className={embedded ? tableWrapperEmbedded : tableWrapper}>
        <div className={headerSummaryCard}>
          <div className={headerSummaryGrid}>
            <strong className={headerSummaryTitle}>Saved recipes</strong>
            <span className={`${headerSummaryMeta} ${headerSummaryMetaSplit}`}>
              {recipeEntries.length} recipes
            </span>
          </div>
        </div>

        <div className={tableCard}>
          <table className={table} aria-label="Recipe history table">
            <thead>
              <tr>
                <th className={tableHeadCell}>Recipe</th>
                <th className={tableHeadCell}>Items</th>
                <th className={`${tableHeadCell} ${tableCellRight}`}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {!loading && recipeEntries.length === 0 ? (
                <tr>
                  <th className={placeholderRow} colSpan={3} scope="row">
                    No recipes yet
                  </th>
                </tr>
              ) : null}

              {recipeEntries.map(([slug, recipe], index) => {
                const label = recipe.title || unslugify(slug)
                const openEditor = () => {
                  setRecipeToEdit(slug)
                  setEditDialogOpen(true)
                }

                return (
                  <tr key={slug} className={index === recipeEntries.length - 1 ? tableRowLast : undefined}>
                    <th className={`${tableCell} ${tableCellStrong} ${itemCell}`} scope="row">
                      <Button className={historyRowAction} variant="ghost" onClick={openEditor}>
                        <span className={itemCellContent}>
                          <span className={itemCellEmoji}>
                            {recipe.emoji ? <Emoji emoji={recipe.emoji} size={18} /> : <ChefHat size={16} />}
                          </span>
                          <span className={itemCellLabel}>{label}</span>
                        </span>
                      </Button>
                    </th>
                    <td className={tableCell}>
                      <Button className={historyRowAction} variant="ghost" onClick={openEditor}>
                        <div className={recipeIngredients}>
                          {recipe.ingredients.map(ingredient => unslugify(ingredient.slug)).join(", ")}
                        </div>
                      </Button>
                    </td>
                    <td className={`${tableCell} ${tableCellRight}`}>
                      <IconButton onClick={() => backend.handleRecipeDelete(slug)} aria-label={`Delete ${label}`}>
                        <Trash2 size={18} />
                      </IconButton>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <EditRecipeDialog
        item={recipeToEdit}
        open={editDialogOpen}
        onSubmit={entry => backend.handleRecipeEdit(entry)}
        onDelete={item => backend.handleRecipeDelete(item)}
        onClose={() => setEditDialogOpen(false)}
      />
    </>
  )
}

export default Recipes
