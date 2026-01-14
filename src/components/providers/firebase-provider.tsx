import { createContext, useContext, type ReactNode } from "react"
import { useListData } from "@/hooks/use-list-data"
import type { Item, CatalogueEntry, PlannerDay } from "@/types"
import type { FirestoreBackend } from "@/lib/firestore"

interface FirebaseContextValue {
  items: Item[]
  catalogue: Record<string, CatalogueEntry>
  planner: Record<string, PlannerDay>
  loading: boolean
  backend: FirestoreBackend
}

export const FirebaseContext = createContext<FirebaseContextValue | null>(null)

export function FirebaseProvider({ 
  listId, 
  children 
}: { 
  listId: string
  children: ReactNode 
}) {
  const data = useListData(listId)
  
  return (
    <FirebaseContext.Provider value={data}>
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebaseContext() {
  const context = useContext(FirebaseContext)
  
  if (!context) {
    throw new Error("useFirebaseContext must be used within FirebaseProvider")
  }
  
  return context
}
