import { useReducer } from "react"
import { normalizeSection, slugify, prettify } from "../../../helpers"
import { ShoppingItem, CatalogueEntry } from "../../Backend/backend"

export interface DialogState {
  item: string
  section: string
  quantity: number
  emoji: string | null
  actionLabel: string
  actionDisabled: boolean
}

type Action =
  | { type: "reset" }
  | {
      type: "set" | "item" | "section" | "quantity" | "emoji"
      item?: ShoppingItem
      items?: ShoppingItem[]
      catalogue?: Record<string, CatalogueEntry>
      newItem?: string
      newSection?: string
      newQuantity?: number
      newEmoji?: string | null
    }

export const defaultState: DialogState = {
  item: "",
  section: "",
  quantity: 1,
  emoji: null,
  actionLabel: "Save",
  actionDisabled: false,
}

export const reducer = (state: DialogState, action: Action): DialogState => {
  if (action.type === "reset") return defaultState

  const {
    type,
    item,
    items = [],
    catalogue = {},
    newItem,
    newSection,
    newQuantity,
    newEmoji,
  } = action

  if (type === "set" && item) {
    const catalogueEntry = catalogue[slugify(item.name)]
    const originalSection = catalogueEntry?.section
    const originalEmoji = catalogueEntry?.emoji
    const originalQuantity = item.quantity || 1

    return {
      ...defaultState,
      item: item.name,
      section: normalizeSection(originalSection || ""),
      quantity: originalQuantity,
      emoji: originalEmoji ?? null,
      actionDisabled: true,
    }
  }

  const originalName = item?.name || ""
  const catalogueEntry = catalogue[slugify(item?.name || "")]
  const originalSection = normalizeSection(catalogueEntry?.section || "")
  const originalEmoji = catalogueEntry?.emoji
  const originalQuantity = item?.quantity || 1

  let newState: DialogState = {
    ...state,
    item: type === "item" ? newItem || "" : state.item,
    section: type === "section" ? newSection || "" : state.section,
    quantity: type === "quantity" ? newQuantity || 1 : state.quantity,
    emoji: type === "emoji" ? (newEmoji ?? null) : state.emoji,
  }

  const noChanges =
    prettify(newState.item) === prettify(originalName) &&
    normalizeSection(newState.section) === originalSection &&
    newState.quantity === originalQuantity &&
    newState.emoji === originalEmoji

  const alreadyExists =
    prettify(newState.item) !== prettify(originalName) &&
    items.some((i: ShoppingItem) => prettify(i.name) === prettify(newState.item))

  if (alreadyExists) {
    newState.actionLabel = "Already exists!"
    newState.actionDisabled = true
  } else {
    newState.actionLabel = defaultState.actionLabel
    newState.actionDisabled = noChanges
  }

  return newState
}

export const useDialogState = () => useReducer(reducer, defaultState)
