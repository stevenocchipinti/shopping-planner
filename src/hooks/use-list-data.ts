import { useEffect, useState, useRef } from "react"
import { FirestoreBackend } from "@/lib/firestore"
import type { Item, CatalogueEntry, PlannerDay, Recipe } from "@/types"

export function useListData(listId: string) {
  const [items, setItems] = useState<Item[]>([])
  const [catalogue, setCatalogue] = useState<Record<string, CatalogueEntry>>({})
  const [planner, setPlanner] = useState<Record<string, PlannerDay>>({})
  const [recipes, setRecipes] = useState<Record<string, Recipe>>({})
  const [loading, setLoading] = useState(true)
  const backendRef = useRef<FirestoreBackend | null>(null)

  useEffect(() => {
    // Create new backend for the current listId
    const backend = new FirestoreBackend(listId)
    backendRef.current = backend

    // Reset loading state when listId changes
    setLoading(true)

    const unsubItems = backend.subscribeToItems(setItems)
    const unsubCatalogue = backend.subscribeToCatalogue(setCatalogue)
    const unsubPlanner = backend.subscribeToPlanner(setPlanner)
    const unsubRecipes = backend.subscribeToRecipes(setRecipes)

    // Mark as loaded after initial snapshots
    const timer = setTimeout(() => setLoading(false), 500)

    return () => {
      unsubItems()
      unsubCatalogue()
      unsubPlanner()
      unsubRecipes()
      backend.disconnect()
      clearTimeout(timer)
    }
  }, [listId])

  return {
    items,
    catalogue,
    planner,
    recipes,
    loading,
    backend: backendRef.current!,
  }
}
