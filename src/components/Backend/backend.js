import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore"

import { slugify } from "../../helpers"
import { db } from "../../firebase"

export function generateListName() {
  return doc(collection(db, "lists")).id
}

export class Backend {
  constructor(listName, callbacks) {
    this.unsubFunctions = []
    this.callbacks = callbacks

    this.connectToList(listName)
  }

  connectToList(listName) {
    this.disconnect()

    this.items = []
    this.catalogue = {}
    this.planner = {}
    this.recipes = {}

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
          this.catalogue = querySnapshot.docs.reduce(
            (a, doc) => ({ ...a, [doc.id]: doc.data() }),
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
          this.items = querySnapshot.docs.map(d => d.data())
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
          this.planner = querySnapshot.docs.reduce(
            (a, doc) => ({ ...a, [doc.id]: doc.data() }),
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
          this.recipes = querySnapshot.docs.reduce(
            (a, doc) => ({ ...a, [doc.id]: doc.data() }),
            {}
          )
          this.callbacks.onRecipesChanged(this.recipes)
          this.setDone()
        }
      )
    )
  }

  disconnect() {
    this.unsubFunctions.forEach(unsub => unsub())
    this.unsubFunctions = []
  }

  setLoading() {
    this.callbacks.onLoadingChanged(true)
  }

  setDone() {
    this.callbacks.onLoadingChanged(false)
  }

  actions() {
    return {
      handleAdd: ({ item, section, quantity = 1, emoji = null }) => {
        const slug = slugify(item)
        const batch = writeBatch(db)
        batch.set(doc(this.itemsRef, slug), {
          name: item,
          quantity,
          done: false,
        })
        batch.set(doc(this.catalogueRef, slug), { section, emoji })
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
          section: newSection,
          emoji: newEmoji,
        })
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
        const newItem = { type, name: slug }
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
        if (type === "item")
          batch.set(doc(this.catalogueRef, newSlug), { emoji: newEmoji })
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
