export interface ShoppingItem {
  name: string
  quantity?: number
  done: boolean
  emoji?: string | null
}

export interface CatalogueEntry {
  section?: string
  emoji?: string | null
}

export interface PlannerItem {
  type: "item" | "recipe"
  name: string
}

export interface PlannerDay {
  items: PlannerItem[]
}

export interface RecipeEntry {
  ingredients: Array<{ slug: string }>
  emoji?: string | null
  title?: string
  image?: string
  description?: string
  instagram?: string
}
