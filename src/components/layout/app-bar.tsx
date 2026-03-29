import { useLocation, useParams } from "react-router-dom"
import { Menu, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFirebaseContext } from "@/contexts/firebase-context"

interface AppBarProps {
  onMenuClick?: () => void
}

export function AppBar({ onMenuClick }: AppBarProps) {
  const { items, planner, backend } = useFirebaseContext()
  const location = useLocation()
  const { listId } = useParams<{ listId: string }>()

  const isListView = location.pathname === `/list/${listId}`
  const isPlannerView = location.pathname === `/list/${listId}/planner`
  const isCatalogueView = location.pathname === `/list/${listId}/catalogue`

  const hasDoneItems = items.some(item => item.done)
  const hasPlannerItems = Object.values(planner).some(
    day => day.items?.length > 0
  )

  const handleSweep = async () => {
    if (isListView && hasDoneItems) {
      await backend.sweepDoneItems(items)
    } else if (isPlannerView && hasPlannerItems) {
      // Only get days that actually have items
      const daysWithItems = Object.entries(planner)
        .filter(([, day]) => day.items?.length > 0)
        .map(([dayName]) => dayName)
      await backend.clearPlanner(daysWithItems)
    }
  }

  const showSweepButton =
    (isListView && hasDoneItems) || (isPlannerView && hasPlannerItems)
  const sweepTitle = isPlannerView ? "Clear planner" : "Remove checked items"

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className=""
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          <h1 className="text-lg font-semibold">
            {isPlannerView
              ? "Weekly planner"
              : isCatalogueView
                ? "Catalogue"
                : isListView
                  ? "Shopping list"
                  : "Shopping Planner"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {showSweepButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSweep}
              title={sweepTitle}
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">{sweepTitle}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
