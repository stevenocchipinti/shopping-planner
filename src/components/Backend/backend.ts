import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
  Unsubscribe,
  CollectionReference,
  DocumentReference,
} from "firebase/firestore"

import { normalizeSection, slugify } from "../../helpers"
import { db } from "../../firebase"

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

export interface BackendCallbacks {
  onItemsChanged: (items: ShoppingItem[]) => void
  onCatalogueChanged: (catalogue: Record<string, CatalogueEntry>) => void
  onPlannerChanged: (planner: Record<string, PlannerDay>) => void
  onRecipesChanged: (recipes: Record<string, RecipeEntry>) => void
  onLoadingChanged: (loading: boolean) => void
  onSyncStateChanged: (state: { hasPendingWrites: boolean }) => void
}

// Action parameter types
export interface AddItemParams {
  item: string
  section: string
  quantity?: number
  emoji?: string | null
}

export interface EditItemParams {
  item: ShoppingItem
  newItem: string
  newSection: string
  newQuantity?: number
  newEmoji?: string | null
}

export interface AddToPlannerParams {
  day: string
  name: string
  ingredients: string[]
  emoji?: string | null
}

export interface EditCatalogueParams {
  item: string
  newItem: string
  newSection: string
  newEmoji?: string | null
}

export interface EditRecipeParams {
  item: string
  newItem: string
  newIngredients: string[]
  newEmoji?: string | null
}

export interface EditPlannerItemParams {
  item: { name: string; day: string }
  newItem: string
  newDay: string
  newEmoji?: string | null
  newIngredients: string[]
}

export interface DeleteFromPlannerParams {
  item: string
  day: string
}

export interface AddPlanToListItem {
  name: string
  section: string
  quantity: number
}

export interface BackendActions {
  handleAdd: (params: AddItemParams) => void
  handleEdit: (params: EditItemParams) => void
  handleCatalogueEdit: (params: EditCatalogueParams) => void
  handleRecipeEdit: (params: EditRecipeParams) => void
  handleMark: (item: ShoppingItem) => void
  handleDelete: (params: { name: string }) => void
  handleCatalogueDelete: (item: string) => void
  handleRecipeDelete: (item: string) => void
  handleSweep: () => void
  handleAddToPlanner: (params: AddToPlannerParams) => void
  handleDeleteFromPlanner: (params: DeleteFromPlannerParams) => void
  handleEditPlannerItem: (params: EditPlannerItemParams) => void
  handleClearPlanner: () => void
  handleAddPlanToList: (items: AddPlanToListItem[]) => void
}

export function generateListName(): string {
  return doc(collection(db, "lists")).id
}

export class Backend {
  private unsubFunctions: Unsubscribe[] = []
  private callbacks: BackendCallbacks
  private items: ShoppingItem[] = []
  private catalogue: Record<string, CatalogueEntry> = {}
  private planner: Record<string, PlannerDay> = {}
  private recipes: Record<string, RecipeEntry> = {}
  private pendingWrites = {
    catalogue: false,
    items: false,
    planner: false,
    recipes: false,
  }

  private listRef!: DocumentReference
  private itemsRef!: CollectionReference
  private catalogueRef!: CollectionReference
  private plannerRef!: CollectionReference
  private recipesRef!: CollectionReference

  constructor(listName: string, callbacks: BackendCallbacks) {
    this.unsubFunctions = []
    this.callbacks = callbacks

    this.connectToList(listName)
  }

  private connectToList(listName: string): void {
    this.disconnect()

    this.items = []
    this.catalogue = {}
    this.planner = {}
    this.recipes = {}
    this.pendingWrites = {
      catalogue: false,
      items: false,
      planner: false,
      recipes: false,
    }

    this.listRef = doc(db, "lists", listName)
    this.itemsRef = collection(this.listRef, "items")
    this.catalogueRef = collection(this.listRef, "catalogue")
    this.plannerRef = collection(this.listRef, "planner")
    this.recipesRef = collection(this.listRef, "recipes")

    this.setLoading()

    this.unsubFunctions.push(
      onSnapshot(
        this.catalogueRef,
        { includeMetadataChanges: true },
        querySnapshot => {
          this.updateSyncState("catalogue", querySnapshot.metadata.hasPendingWrites)
          this.catalogue = querySnapshot.docs.reduce(
            (a, doc) => ({ ...a, [doc.id]: doc.data() as CatalogueEntry }),
            {}
          )
          this.callbacks.onCatalogueChanged(this.catalogue)
          this.setDone()
        }
      )
    )

    this.unsubFunctions.push(
      onSnapshot(
        this.itemsRef,
        { includeMetadataChanges: true },
        querySnapshot => {
          this.updateSyncState("items", querySnapshot.metadata.hasPendingWrites)
          this.items = querySnapshot.docs.map(d => d.data() as ShoppingItem)
          this.callbacks.onItemsChanged(this.items)
          this.setDone()
        }
      )
    )

    this.unsubFunctions.push(
      onSnapshot(
        this.plannerRef,
        { includeMetadataChanges: true },
        querySnapshot => {
          this.updateSyncState("planner", querySnapshot.metadata.hasPendingWrites)
          this.planner = querySnapshot.docs.reduce(
            (a, doc) => ({ ...a, [doc.id]: doc.data() as PlannerDay }),
            {}
          )
          this.callbacks.onPlannerChanged(this.planner)
          this.setDone()
        }
      )
    )

    this.unsubFunctions.push(
      onSnapshot(
        this.recipesRef,
        { includeMetadataChanges: true },
        querySnapshot => {
          this.updateSyncState("recipes", querySnapshot.metadata.hasPendingWrites)
          this.recipes = querySnapshot.docs.reduce(
            (a, doc) => ({ ...a, [doc.id]: doc.data() as RecipeEntry }),
            {}
          )
          this.callbacks.onRecipesChanged(this.recipes)
          this.setDone()
        }
      )
    )
  }

  public disconnect(): void {
    this.unsubFunctions.forEach(unsub => unsub())
    this.unsubFunctions = []
  }

  private setLoading(): void {
    this.callbacks.onLoadingChanged(true)
  }

  private setDone(): void {
    this.callbacks.onLoadingChanged(false)
  }

  private updateSyncState(
    key: keyof Backend["pendingWrites"],
    hasPendingWrites: boolean
  ): void {
    this.pendingWrites[key] = hasPendingWrites
    this.callbacks.onSyncStateChanged({
      hasPendingWrites: Object.values(this.pendingWrites).some(Boolean),
    })
  }

  private renamePlannerEntries(
    batch: ReturnType<typeof writeBatch>,
    type: PlannerItem["type"],
    existingSlug: string,
    newSlug: string
  ): void {
    Object.entries(this.planner).forEach(([day, plannerDay]) => {
      let changed = false

      const items = plannerDay.items.map(entry => {
        if (entry.type !== type || entry.name !== existingSlug) return entry
        changed = true
        return { ...entry, name: newSlug }
      })

      if (changed) batch.set(doc(this.plannerRef, day), { items })
    })
  }

  private renameRecipeIngredientReferences(
    batch: ReturnType<typeof writeBatch>,
    existingSlug: string,
    newSlug: string
  ): void {
    Object.entries(this.recipes).forEach(([slug, recipe]) => {
      let changed = false

      const ingredients = recipe.ingredients.map(ingredient => {
        if (ingredient.slug !== existingSlug) return ingredient
        changed = true
        return { slug: newSlug }
      })

      if (changed) {
        batch.set(doc(this.recipesRef, slug), { ...recipe, ingredients })
      }
    })
  }

  private moveListItem(
    batch: ReturnType<typeof writeBatch>,
    existingSlug: string,
    newSlug: string,
    item: ShoppingItem
  ): void {
    if (existingSlug !== newSlug) batch.delete(doc(this.itemsRef, existingSlug))
    batch.set(doc(this.itemsRef, newSlug), item)
  }

  private moveCatalogueEntry(
    batch: ReturnType<typeof writeBatch>,
    existingSlug: string,
    newSlug: string,
    entry: CatalogueEntry
  ): void {
    if (existingSlug !== newSlug) batch.delete(doc(this.catalogueRef, existingSlug))
    batch.set(doc(this.catalogueRef, newSlug), entry)
  }

  private moveRecipeEntry(
    batch: ReturnType<typeof writeBatch>,
    existingSlug: string,
    newSlug: string,
    entry: RecipeEntry
  ): void {
    if (existingSlug !== newSlug) batch.delete(doc(this.recipesRef, existingSlug))
    batch.set(doc(this.recipesRef, newSlug), entry)
  }

  public actions(): BackendActions {
    return {
      handleAdd: ({ item, section, quantity = 1, emoji = null }) => {
        const slug = slugify(item)
        const batch = writeBatch(db)
        batch.set(doc(this.itemsRef, slug), {
          name: item,
          quantity,
          done: false,
        })
        batch.set(doc(this.catalogueRef, slug), {
          section: normalizeSection(section),
          emoji,
        })
        batch.commit()
      },

      handleEdit: ({
        item,
        newItem,
        newSection,
        newQuantity = 1,
        newEmoji = null,
      }) => {
        const existingSlug = slugify(item.name)
        const newSlug = slugify(newItem)
        const batch = writeBatch(db)
        batch.delete(doc(this.itemsRef, existingSlug))
        batch.set(doc(this.itemsRef, newSlug), {
          name: newItem,
          quantity: newQuantity,
          done: false,
        })
        batch.set(doc(this.catalogueRef, newSlug), {
          section: normalizeSection(newSection),
          emoji: newEmoji,
        })
        this.renamePlannerEntries(batch, "item", existingSlug, newSlug)
        this.renameRecipeIngredientReferences(batch, existingSlug, newSlug)
        batch.commit()
      },

      handleCatalogueEdit: ({ item, newItem, newSection, newEmoji = null }) => {
        const existingSlug = slugify(item)
        const newSlug = slugify(newItem)
        const batch = writeBatch(db)
        const existingItem = this.items.find(entry => slugify(entry.name) === existingSlug)

        this.moveCatalogueEntry(batch, existingSlug, newSlug, {
          section: normalizeSection(newSection),
          emoji: newEmoji,
        })

        if (existingItem) {
          this.moveListItem(batch, existingSlug, newSlug, {
            ...existingItem,
            name: newItem,
          })
        }

        this.renamePlannerEntries(batch, "item", existingSlug, newSlug)
        this.renameRecipeIngredientReferences(batch, existingSlug, newSlug)
        batch.commit()
      },

      handleRecipeEdit: ({ item, newItem, newIngredients, newEmoji = null }) => {
        const existingSlug = slugify(item)
        const newSlug = slugify(newItem)
        const existingRecipe = this.recipes[existingSlug]
        if (!existingRecipe) return

        const batch = writeBatch(db)
        this.moveRecipeEntry(batch, existingSlug, newSlug, {
          ...existingRecipe,
          emoji: newEmoji,
          title: newItem,
          ingredients: newIngredients.map(ingredient => ({ slug: slugify(ingredient) })),
        })
        this.renamePlannerEntries(batch, "recipe", existingSlug, newSlug)
        batch.commit()
      },

      handleMark: item => {
        const slug = slugify(item.name)
        updateDoc(doc(this.itemsRef, slug), { done: !item.done })
      },

      handleDelete: ({ name }) => {
        const slug = slugify(name)
        deleteDoc(doc(this.itemsRef, slug))
      },

      handleCatalogueDelete: item => {
        deleteDoc(doc(this.catalogueRef, item))
      },

      handleRecipeDelete: item => {
        deleteDoc(doc(this.recipesRef, item))
      },

      handleSweep: () => {
        const batch = writeBatch(db)
        this.items
          .filter(item => item.done)
          .forEach(item => {
            batch.delete(doc(this.itemsRef, slugify(item.name)))
          })
        batch.commit()
      },

      handleAddToPlanner: ({ day, name, ingredients, emoji }) => {
        const slug = slugify(name)
        const type = ingredients.length === 0 ? "item" : "recipe"
        const newItem: PlannerItem = { type, name: slug }
        const plannedItems = this.planner?.[day]?.items || []

        const batch = writeBatch(db)
        batch.set(doc(this.plannerRef, day), {
          items: [...plannedItems, newItem],
        })
        if (type === "item") batch.set(doc(this.catalogueRef, slug), { emoji })
        if (type === "recipe")
          batch.set(doc(this.recipesRef, slug), {
            ingredients: ingredients.map(i => ({ slug: slugify(i) })),
            emoji,
          })
        batch.commit()
      },

      handleDeleteFromPlanner: ({ item, day }) => {
        const existingSlug = slugify(item)
        const existingItemsForExistingDay = this.planner?.[day]?.items || []
        const newItemsForExistingDay = existingItemsForExistingDay.filter(
          ({ name: slug }) => slug !== existingSlug
        )
        const existingDayNowEmpty = newItemsForExistingDay.length === 0

        if (existingDayNowEmpty) {
          deleteDoc(doc(this.plannerRef, day))
        } else {
          setDoc(doc(this.plannerRef, day), {
            items: newItemsForExistingDay,
          })
        }
      },

      handleEditPlannerItem: ({
        item,
        newItem,
        newDay,
        newEmoji,
        newIngredients,
      }) => {
        const type = newIngredients.length === 0 ? "item" : "recipe"
        const existingSlug = slugify(item.name)
        const newSlug = slugify(newItem)
        const editingTheSameDay = item.day === newDay

        const existingItemsForExistingDay =
          this.planner?.[item?.day]?.items || []
        const newItemsForExistingDay = existingItemsForExistingDay.filter(
          ({ name: slug }) => slug !== existingSlug
        )
        const existingDayNowEmpty = newItemsForExistingDay.length === 0

        const existingItemsForNewDay = this.planner?.[newDay]?.items || []
        const newItemsForNewDay = editingTheSameDay
          ? [...newItemsForExistingDay, { type, name: newSlug }]
          : [...existingItemsForNewDay, { type, name: newSlug }]

        const batch = writeBatch(db)
        if (existingDayNowEmpty) {
          batch.delete(doc(this.plannerRef, item?.day))
        } else {
          batch.set(doc(this.plannerRef, item?.day), {
            items: newItemsForExistingDay,
          })
        }
        batch.set(doc(this.plannerRef, newDay), {
          items: newItemsForNewDay,
        })
        if (type === "item") {
          batch.set(doc(this.catalogueRef, newSlug), { emoji: newEmoji })
          this.renameRecipeIngredientReferences(batch, existingSlug, newSlug)
        }
        if (type === "recipe")
          batch.set(doc(this.recipesRef, newSlug), {
            ingredients: newIngredients.map(i => ({ slug: slugify(i) })),
            emoji: newEmoji,
          })
        batch.commit()
      },

      handleClearPlanner: () => {
        const batch = writeBatch(db)
        Object.keys(this.planner).forEach(day => {
          batch.delete(doc(this.plannerRef, day))
        })
        batch.commit()
      },

      handleAddPlanToList: items => {
        const batch = writeBatch(db)
        items.forEach(({ name, section, quantity }) => {
          const slug = slugify(name)
          batch.set(doc(this.itemsRef, slug), { name, quantity, done: false })
        })
        batch.commit()
      },
    }
  }
}
