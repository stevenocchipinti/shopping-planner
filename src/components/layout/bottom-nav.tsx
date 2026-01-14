import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ShoppingCart, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { listId } = useParams<{ listId: string }>()

  const tabs = [
    {
      label: "List",
      icon: ShoppingCart,
      path: `/list/${listId}`,
      isActive: location.pathname === `/list/${listId}`,
    },
    {
      label: "Planner",
      icon: Calendar,
      path: `/list/${listId}/planner`,
      isActive: location.pathname === `/list/${listId}/planner`,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-around px-4">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
              tab.isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
