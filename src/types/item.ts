// Item in the shopping list
export interface Item {
  name: string
  quantity: number
  done: boolean
}

// Catalogue entry (metadata about items)
export interface CatalogueEntry {
  section: string
  emoji: string | null
}

// Item with metadata from catalogue
export interface ItemWithMetadata extends Item {
  slug: string
  emoji: string | null
  section: string
}
