import React, { useEffect, useRef, useState, createContext, ReactNode } from "react"
import {
  Backend,
  generateListName,
  BackendActions,
  ShoppingItem,
  CatalogueEntry,
  PlannerDay,
  RecipeEntry,
  BackendCallbacks,
} from "./backend"

interface AppState {
  items: ShoppingItem[]
  catalogue: Record<string, CatalogueEntry>
  planner: Record<string, PlannerDay>
  recipes: Record<string, RecipeEntry>
  loading: boolean
  isOnline: boolean
  showingCachedData: boolean
  hasPendingWrites: boolean
  recentlyReconnected: boolean
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
  const [hasPendingWrites, setHasPendingWrites] = useState(false)
  const [recentlyReconnected, setRecentlyReconnected] = useState(false)
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine
  )
  const [actions, setActions] = useState<BackendActions | undefined>(undefined)
  const showingCachedData = !isOnline
  const wasOfflineRef = useRef(!isOnline)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (wasOfflineRef.current) {
        setRecentlyReconnected(true)
      }
    }
    const handleOffline = () => {
      wasOfflineRef.current = true
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!isOnline) return

    if (!hasPendingWrites) {
      setRecentlyReconnected(false)
      wasOfflineRef.current = false
    }
  }, [hasPendingWrites, isOnline])

  useEffect(() => {
    window.localStorage.setItem("listName", listId)
    const instance = new Backend(listId, {
      onItemsChanged: items => setItems(items),
      onCatalogueChanged: catalogue => setCatalogue(catalogue),
      onPlannerChanged: planner => setPlanner(planner),
      onRecipesChanged: recipes => setRecipes(recipes),
      onLoadingChanged: loading => setLoading(loading),
      onSyncStateChanged: (state: Parameters<BackendCallbacks["onSyncStateChanged"]>[0]) =>
        setHasPendingWrites(state.hasPendingWrites),
    })

    backend.current = instance
    setActions(instance.actions())

    return () => {
      setActions(undefined)
      setHasPendingWrites(false)
      instance.disconnect()
      if (backend.current === instance) {
        backend.current = null
      }
    }
  }, [listId])

  return (
    <AppContext.Provider
      value={{
        items,
        catalogue,
        planner,
        recipes,
        loading,
        isOnline,
        showingCachedData,
        hasPendingWrites,
        recentlyReconnected,
      }}
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
