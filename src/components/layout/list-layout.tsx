import { useState } from "react"
import { useParams, Outlet } from "react-router-dom"
import { Plus } from "lucide-react"
import { FirebaseProvider } from "@/components/providers/firebase-provider"
import { AppBar } from "./app-bar"
import { BottomNav } from "./bottom-nav"
import { Button } from "@/components/ui/button"
import { AddItemDialog } from "@/components/dialogs/add-item-dialog"

export function ListLayout() {
  const { listId } = useParams<{ listId: string }>()
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  if (!listId) {
    return <div>Invalid list ID</div>
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
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add item</span>
        </Button>

        <AddItemDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
        />
      </div>
    </FirebaseProvider>
  )
}
