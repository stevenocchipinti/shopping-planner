import { useEffect, useState } from "react"
import { FirestoreBackend } from "@/lib/firestore"
import type { Item, CatalogueEntry, PlannerDay, Recipe } from "@/types"

export function useListData(listId: string) {
  const [items, setItems] = useState<Item[]>([])
  const [catalogue, setCatalogue] = useState<Record<string, CatalogueEntry>>({})
  const [planner, setPlanner] = useState<Record<string, PlannerDay>>({})
  const [recipes, setRecipes] = useState<Record<string, Recipe>>({})
  const [loading, setLoading] = useState(true)
  const [backend, setBackend] = useState<FirestoreBackend | null>(null)

  useEffect(() => {
    // Create new backend for the current listId
    const newBackend = new FirestoreBackend(listId)
    // We need to set the backend instance synchronously here because the subscriptions below
    // depend on it. This is managing the lifecycle of the Firestore connection, which is a
    // legitimate external system synchronization pattern in React.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBackend(newBackend)

    // Reset loading state when listId changes
     
    setLoading(true)

    const unsubItems = newBackend.subscribeToItems(setItems)
    const unsubCatalogue = newBackend.subscribeToCatalogue(setCatalogue)
    const unsubPlanner = newBackend.subscribeToPlanner(setPlanner)
    const unsubRecipes = newBackend.subscribeToRecipes(setRecipes)

    // Mark as loaded after initial snapshots
    const timer = setTimeout(() => setLoading(false), 500)

    return () => {
      unsubItems()
      unsubCatalogue()
      unsubPlanner()
      unsubRecipes()
      newBackend.disconnect()
      clearTimeout(timer)
    }
    // This effect manages Firebase subscriptions and backend lifecycle
     
  }, [listId])

  return {
    items,
    catalogue,
    planner,
    recipes,
    loading,
    backend: backend!,
  }
}
