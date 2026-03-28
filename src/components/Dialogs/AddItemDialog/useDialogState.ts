import { useReducer } from "react"
import { normalizeSection, slugify } from "../../../helpers"
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
      type: "item" | "section" | "quantity" | "emoji"
      items: ShoppingItem[]
      catalogue: Record<string, CatalogueEntry>
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
  actionLabel: "Add",
  actionDisabled: true,
}

export const reducer = (state: DialogState, action: Action): DialogState => {
  if (action.type === "reset") return defaultState

  const { items, catalogue, newItem, newSection, newQuantity, newEmoji } = action

  let newState: DialogState = {
    ...defaultState,
    item: action.type === "item" ? newItem || "" : state.item,
    section: action.type === "section" ? newSection || "" : state.section,
    quantity: action.type === "quantity" ? newQuantity || 1 : state.quantity,
    emoji: action.type === "emoji" ? (newEmoji ?? null) : state.emoji,
  }

  const itemOnList = items.find(i => i.name === newState.item)
  const catalogueEntry = catalogue[slugify(newState.item)]
  const storedSection = normalizeSection(catalogueEntry?.section || "")
  const storedQuantity = itemOnList?.quantity

  if (newState.item.trim().length > 0) newState.actionDisabled = false
  if (newItem && storedSection) newState.section = storedSection
  if (newItem && storedQuantity) newState.quantity = storedQuantity

  const currentSection = normalizeSection(newState.section)

  if (itemOnList && currentSection !== storedSection) {
    newState.actionLabel = "Move"
  } else if (
    itemOnList &&
    currentSection === storedSection &&
    newState.quantity === (storedQuantity || 1)
  ) {
    if (itemOnList.done) {
      newState.actionLabel = "Uncheck"
      newState.actionDisabled = false
    } else {
      newState.actionLabel = "Already exists!"
      newState.actionDisabled = true
    }
  } else if (itemOnList && storedQuantity !== newState?.quantity) {
    newState.actionLabel = "Update"
  }

  return newState
}

export default () => useReducer(reducer, defaultState)
