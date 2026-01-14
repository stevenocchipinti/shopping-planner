import { useState } from "react"
import { useParams, useLocation, Outlet } from "react-router-dom"
import { Plus, ShoppingCart } from "lucide-react"
import { FirebaseProvider } from "@/components/providers/firebase-provider"
import { AppBar } from "./app-bar"
import { BottomNav } from "./bottom-nav"
import { Button } from "@/components/ui/button"
import { AddItemDialog } from "@/components/dialogs/add-item-dialog"
import { AddPlanToListDialog } from "@/components/dialogs/add-plan-to-list-dialog"

export function ListLayout() {
  const { listId } = useParams<{ listId: string }>()
  const location = useLocation()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addPlanToListDialogOpen, setAddPlanToListDialogOpen] = useState(false)

  if (!listId) {
    return <div>Invalid list ID</div>
  }

  const isPlannerView = location.pathname === `/list/${listId}/planner`

  const handleFabClick = () => {
    if (isPlannerView) {
      setAddPlanToListDialogOpen(true)
    } else {
      setAddDialogOpen(true)
    }
  }

  return (
    <FirebaseProvider listId={listId}>
      <div className="min-h-screen flex flex-col bg-background">
        <AppBar />
        <main className="flex-1 pb-24">
          <Outlet context={{ setAddDialogOpen }} />
        </main>
        <BottomNav />
        
        {/* FAB - Floating Action Button */}
        <Button
          size="icon"
          className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg"
          onClick={handleFabClick}
          title={isPlannerView ? "Add plan to list" : "Add item"}
        >
          {isPlannerView ? (
            <ShoppingCart className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
          <span className="sr-only">{isPlannerView ? "Add plan to list" : "Add item"}</span>
        </Button>

        <AddItemDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
        />
        
        <AddPlanToListDialog
          open={addPlanToListDialogOpen}
          onOpenChange={setAddPlanToListDialogOpen}
        />
      </div>
    </FirebaseProvider>
  )
}
