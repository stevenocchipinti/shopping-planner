import { createContext, useContext } from "react"
import type { Item, CatalogueEntry, PlannerDay, Recipe } from "@/types"
import type { FirestoreBackend } from "@/lib/firestore"

export interface FirebaseContextValue {
  items: Item[]
  catalogue: Record<string, CatalogueEntry>
  planner: Record<string, PlannerDay>
  recipes: Record<string, Recipe>
  loading: boolean
  backend: FirestoreBackend
}

export const FirebaseContext = createContext<FirebaseContextValue | null>(null)

export function useFirebaseContext() {
  const context = useContext(FirebaseContext)

  if (!context) {
    throw new Error("useFirebaseContext must be used within FirebaseProvider")
  }

  return context
}
