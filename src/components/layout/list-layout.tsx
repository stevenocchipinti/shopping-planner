import { useState } from "react"
import { useParams, useLocation, Outlet } from "react-router-dom"
import { Plus, ShoppingCart } from "lucide-react"
import { FirebaseProvider } from "@/components/providers/firebase-provider"
import { ToastProvider, useOnlineStatus } from "@/components/ui/toast"
import { AppBar } from "./app-bar"
import { BottomNav } from "./bottom-nav"
import { AppDrawer } from "./app-drawer"
import { Button } from "@/components/ui/button"
import { AddItemDialog } from "@/components/dialogs/add-item-dialog"
import { AddPlanToListDialog } from "@/components/dialogs/add-plan-to-list-dialog"
import { ShareDialog } from "@/components/dialogs/share-dialog"
import { OpenDialog } from "@/components/dialogs/open-dialog"
import { AboutDialog } from "@/components/dialogs/about-dialog"

function ListLayoutContent() {
  const location = useLocation()
  const { listId } = useParams<{ listId: string }>()
  
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addPlanToListDialogOpen, setAddPlanToListDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [openDialogOpen, setOpenDialogOpen] = useState(false)
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false)

  // Monitor online status for toasts
  useOnlineStatus()

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
    <div className="min-h-screen flex flex-col bg-background">
      <AppBar onMenuClick={() => setDrawerOpen(true)} />
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

      {/* App Drawer */}
      <AppDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onShareClick={() => setShareDialogOpen(true)}
        onOpenListClick={() => setOpenDialogOpen(true)}
        onAboutClick={() => setAboutDialogOpen(true)}
      />

      {/* Dialogs */}
      <AddItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
      
      <AddPlanToListDialog
        open={addPlanToListDialogOpen}
        onOpenChange={setAddPlanToListDialogOpen}
      />

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />

      <OpenDialog
        open={openDialogOpen}
        onOpenChange={setOpenDialogOpen}
      />

      <AboutDialog
        open={aboutDialogOpen}
        onOpenChange={setAboutDialogOpen}
      />
    </div>
  )
}

export function ListLayout() {
  const { listId } = useParams<{ listId: string }>()

  if (!listId) {
    return <div>Invalid list ID</div>
  }

  return (
    <FirebaseProvider listId={listId}>
      <ToastProvider>
        <ListLayoutContent />
      </ToastProvider>
    </FirebaseProvider>
  )
}
