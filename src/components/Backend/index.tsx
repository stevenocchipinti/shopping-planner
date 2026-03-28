import React, { useEffect, useState, useRef, createContext, ReactNode } from "react"
import {
  Backend,
  generateListName,
  BackendActions,
  ShoppingItem,
  CatalogueEntry,
  PlannerDay,
  RecipeEntry,
} from "./backend"

interface AppState {
  items: ShoppingItem[]
  catalogue: Record<string, CatalogueEntry>
  planner: Record<string, PlannerDay>
  recipes: Record<string, RecipeEntry>
  loading: boolean
}

interface AppProviderProps {
  listId: string
  children: ReactNode
}

const AppContext = createContext<AppState | undefined>(undefined)
const BackendContext = createContext<BackendActions | undefined>(undefined)

const AppProvider: React.FC<AppProviderProps> = ({ listId, children }) => {
  const backend = useRef<Backend | null>(null)

  const [items, setItems] = useState<ShoppingItem[]>([])
  const [catalogue, setCatalogue] = useState<Record<string, CatalogueEntry>>({})
  const [planner, setPlanner] = useState<Record<string, PlannerDay>>({})
  const [recipes, setRecipes] = useState<Record<string, RecipeEntry>>({})
  const [loading, setLoading] = useState(true)
  const [actions, setActions] = useState<BackendActions | undefined>(undefined)

  useEffect(() => {
    window.localStorage.setItem("listName", listId)
    const instance = new Backend(listId, {
      onItemsChanged: items => setItems(items),
      onCatalogueChanged: catalogue => setCatalogue(catalogue),
      onPlannerChanged: planner => setPlanner(planner),
      onRecipesChanged: recipes => setRecipes(recipes),
      onLoadingChanged: loading => setLoading(loading),
    })

    backend.current = instance
    setActions(instance.actions())

    return () => {
      setActions(undefined)
      instance.disconnect()
      if (backend.current === instance) {
        backend.current = null
      }
    }
  }, [listId])

  return (
    <AppContext.Provider
      value={{ items, catalogue, planner, recipes, loading }}
    >
      <BackendContext.Provider value={actions}>
        {actions ? children : null}
      </BackendContext.Provider>
    </AppContext.Provider>
  )
}

const useAppState = (): AppState => {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppProvider")
  }
  return context
}

const useBackend = (): BackendActions => {
  const context = React.useContext(BackendContext)
  if (context === undefined) {
    throw new Error("useBackend must be used within an AppProvider")
  }
  return context
}

export { AppProvider, useAppState, useBackend, generateListName }
