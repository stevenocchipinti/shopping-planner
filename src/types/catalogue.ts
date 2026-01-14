// Recipe document
export interface Recipe {
  ingredients: Array<{ slug: string }>
  emoji: string | null
  image?: string
  description?: string
  instagram?: string
}

// Catalogue data keyed by slug
export type CatalogueData = Record<string, import("./item").CatalogueEntry>

// Recipes data keyed by slug
export type RecipesData = Record<string, Recipe>
