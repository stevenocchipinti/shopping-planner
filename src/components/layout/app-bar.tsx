import { Menu, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFirebaseContext } from "@/components/providers/firebase-provider"

interface AppBarProps {
  onMenuClick?: () => void
}

export function AppBar({ onMenuClick }: AppBarProps) {
  const { items, backend } = useFirebaseContext()
  
  const hasDoneItems = items.some((item) => item.done)

  const handleSweep = async () => {
    if (hasDoneItems) {
      await backend.sweepDoneItems(items)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          <h1 className="text-lg font-semibold">Shopping Planner</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {hasDoneItems && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSweep}
              title="Remove checked items"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Remove checked items</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
