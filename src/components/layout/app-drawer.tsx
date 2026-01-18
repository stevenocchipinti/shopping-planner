import { useNavigate, useParams } from "react-router-dom"
import { 
  Share2, 
  FolderOpen, 
  History, 
  Info,
  ChevronRight,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface AppDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onShareClick: () => void
  onOpenListClick: () => void
  onAboutClick: () => void
}

export function AppDrawer({
  open,
  onOpenChange,
  onShareClick,
  onOpenListClick,
  onAboutClick,
}: AppDrawerProps) {
  const navigate = useNavigate()
  const { listId } = useParams<{ listId: string }>()

  const menuItems = [
    {
      icon: Share2,
      label: "Share Live List",
      description: "Share this list with others",
      onClick: () => {
        onOpenChange(false)
        onShareClick()
      },
    },
    {
      icon: FolderOpen,
      label: "Open List",
      description: "Switch to a different list",
      onClick: () => {
        onOpenChange(false)
        onOpenListClick()
      },
    },
    {
      icon: History,
      label: "History",
      description: "View all past items",
      onClick: () => {
        onOpenChange(false)
        navigate(`/list/${listId}/catalogue`)
      },
    },
    {
      icon: Info,
      label: "About",
      description: "App information",
      onClick: () => {
        onOpenChange(false)
        onAboutClick()
      },
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Shopping Planner</SheetTitle>
        </SheetHeader>
        
        <nav className="mt-6 flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors",
                "hover:bg-accent"
              )}
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
