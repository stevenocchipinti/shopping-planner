import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "./firebase"
import { slugify, prettify } from "./slugify"
import type {
  Item,
  CatalogueEntry,
  PlannerDay,
  PlannerItem,
  Recipe,
} from "@/types"

export class FirestoreBackend {
  private listId: string
  private unsubscribers: Unsubscribe[] = []

  constructor(listId: string) {
    this.listId = listId
  }

  // Collection references
  private get listRef() {
    return doc(db, "lists", this.listId)
  }

  private get itemsRef() {
    return collection(this.listRef, "items")
  }

  private get catalogueRef() {
    return collection(this.listRef, "catalogue")
  }

  private get plannerRef() {
    return collection(this.listRef, "planner")
  }

  private get recipesRef() {
    return collection(this.listRef, "recipes")
  }

  // Real-time listeners
  subscribeToItems(callback: (items: Item[]) => void): Unsubscribe {
    const unsub = onSnapshot(
      this.itemsRef,
      { includeMetadataChanges: true },
      snapshot => {
        const items = snapshot.docs.map(doc => doc.data() as Item)
        callback(items)
      },
      error => {
        console.error("Error subscribing to items:", error)
      }
    )
    this.unsubscribers.push(unsub)
    return unsub
  }

  subscribeToCatalogue(
    callback: (catalogue: Record<string, CatalogueEntry>) => void
  ): Unsubscribe {
    const unsub = onSnapshot(
      this.catalogueRef,
      { includeMetadataChanges: true },
      snapshot => {
        const catalogue = snapshot.docs.reduce(
          (acc, doc) => ({
            ...acc,
            [doc.id]: doc.data() as CatalogueEntry,
          }),
          {} as Record<string, CatalogueEntry>
        )
        callback(catalogue)
      },
      error => {
        console.error("Error subscribing to catalogue:", error)
      }
    )
    this.unsubscribers.push(unsub)
    return unsub
  }

  subscribeToPlanner(
    callback: (planner: Record<string, PlannerDay>) => void
  ): Unsubscribe {
    const unsub = onSnapshot(
      this.plannerRef,
      { includeMetadataChanges: true },
      snapshot => {
        const planner = snapshot.docs.reduce(
          (acc, doc) => {
            const data = doc.data()

            // Keep day name as stored in Firebase (capitalized like the old app)
            const dayKey = doc.id

            // Handle backward compatibility with old app format
            // Old app might store items differently
            let items: PlannerItem[] = []

            if (Array.isArray(data.items)) {
              // New format: items is an array of { type, name }
              items = data.items.map((item: unknown) => {
                if (typeof item === "string") {
                  // Old format: items might be an array of strings (slugs)
                  return { type: "item" as const, name: item }
                }
                // New format: { type, name }
                return item as PlannerItem
              })
            } else if (data.items && typeof data.items === "object") {
              // Old format: items might be an object keyed by slug
              items = Object.entries(data.items).map(([name, itemData]) => {
                if (typeof itemData === "object" && itemData !== null) {
                  return {
                    type:
                      (itemData as { type?: string }).type === "recipe"
                        ? ("recipe" as const)
                        : ("item" as const),
                    name,
                  }
                }
                return { type: "item" as const, name }
              })
            }

            // Don't merge items for different case variants (old app uses capitalized)
            return {
              ...acc,
              [dayKey]: { items } as PlannerDay,
            }
          },
          {} as Record<string, PlannerDay>
        )
        callback(planner)
      },
      error => {
        console.error("Error subscribing to planner:", error)
      }
    )
    this.unsubscribers.push(unsub)
    return unsub
  }

  subscribeToRecipes(
    callback: (recipes: Record<string, Recipe>) => void
  ): Unsubscribe {
    const unsub = onSnapshot(
      this.recipesRef,
      { includeMetadataChanges: true },
      snapshot => {
        const recipes = snapshot.docs.reduce(
          (acc, doc) => ({
            ...acc,
            [doc.id]: doc.data() as Recipe,
          }),
          {} as Record<string, Recipe>
        )
        callback(recipes)
      },
      error => {
        console.error("Error subscribing to recipes:", error)
      }
    )
    this.unsubscribers.push(unsub)
    return unsub
  }

  // Item operations
  async addItem(
    item: string,
    section: string,
    quantity = 1,
    emoji: string | null = null
  ): Promise<void> {
    const prettyItem = prettify(item)
    const prettySection = prettify(section)
    const slug = slugify(prettyItem)
    const batch = writeBatch(db)

    batch.set(doc(this.itemsRef, slug), {
      name: prettyItem,
      quantity,
      done: false,
    })

    batch.set(doc(this.catalogueRef, slug), {
      section: prettySection,
      emoji,
    })

    await batch.commit()
  }

  async editItem(
    oldItem: string,
    newItem: string,
    section: string,
    quantity: number,
    emoji: string | null
  ): Promise<void> {
    const prettyNewItem = prettify(newItem)
    const prettySection = prettify(section)
    const oldSlug = slugify(oldItem)
    const newSlug = slugify(prettyNewItem)
    const batch = writeBatch(db)

    if (oldSlug !== newSlug) {
      batch.delete(doc(this.itemsRef, oldSlug))
    }

    batch.set(doc(this.itemsRef, newSlug), {
      name: prettyNewItem,
      quantity,
      done: false,
    })

    batch.set(doc(this.catalogueRef, newSlug), {
      section: prettySection,
      emoji,
    })

    await batch.commit()
  }

  async toggleItemDone(item: string, currentDone: boolean): Promise<void> {
    const slug = slugify(item)
    await updateDoc(doc(this.itemsRef, slug), {
      done: !currentDone,
    })
  }

  async deleteItem(item: string): Promise<void> {
    const slug = slugify(item)
    await deleteDoc(doc(this.itemsRef, slug))
  }

  async sweepDoneItems(items: Item[]): Promise<void> {
    const batch = writeBatch(db)

    items
      .filter(item => item.done)
      .forEach(item => {
        batch.delete(doc(this.itemsRef, slugify(item.name)))
      })

    await batch.commit()
  }

  async deleteCatalogueItem(item: string): Promise<void> {
    const slug = slugify(item)
    await deleteDoc(doc(this.catalogueRef, slug))
  }

  // Planner operations
  async addToPlannerDay(
    day: string,
    name: string,
    type: "item" | "recipe",
    currentPlanner: Record<string, PlannerDay>,
    emoji: string | null = null,
    ingredients?: string[]
  ): Promise<void> {
    const slug = slugify(name)
    const batch = writeBatch(db)

    // Get existing items for this day
    const existingItems = currentPlanner[day]?.items || []
    const newItem: PlannerItem = { type, name: slug }

    // Update planner day with new item
    const dayRef = doc(this.plannerRef, day)
    batch.set(dayRef, {
      items: [...existingItems, newItem],
    })

    // Update catalogue entry
    batch.set(
      doc(this.catalogueRef, slug),
      {
        section: "",
        emoji,
      },
      { merge: true }
    )

    // If it's a recipe, create/update recipe document
    if (type === "recipe" && ingredients) {
      batch.set(doc(this.recipesRef, slug), {
        ingredients: ingredients.map(i => ({ slug: slugify(i) })),
        emoji,
      })
    }

    await batch.commit()
  }

  async deleteFromPlannerDay(
    day: string,
    itemName: string,
    currentPlanner: Record<string, PlannerDay>
  ): Promise<void> {
    const slug = slugify(itemName)
    const existingItems = currentPlanner[day]?.items || []
    const updatedItems = existingItems.filter(item => item.name !== slug)

    if (updatedItems.length === 0) {
      // Delete the day document if no items left
      await deleteDoc(doc(this.plannerRef, day))
    } else {
      // Update with remaining items
      await setDoc(doc(this.plannerRef, day), {
        items: updatedItems,
      })
    }
  }

  async clearPlanner(plannerDays: string[]): Promise<void> {
    const batch = writeBatch(db)

    plannerDays.forEach(day => {
      batch.delete(doc(this.plannerRef, day))
    })

    await batch.commit()
  }

  async addPlanToList(
    items: Array<{
      name: string
      quantity: number
      section: string
      emoji: string | null
    }>
  ): Promise<void> {
    const batch = writeBatch(db)

    items.forEach(item => {
      const slug = slugify(item.name)
      batch.set(doc(this.itemsRef, slug), {
        name: item.name,
        quantity: item.quantity,
        done: false,
      })
    })

    await batch.commit()
  }

  // Cleanup
  disconnect(): void {
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []
  }
}

// Helper to generate new list IDs
export function generateListId(): string {
  return doc(collection(db, "lists")).id
}
