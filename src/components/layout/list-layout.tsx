import { useParams, Outlet } from "react-router-dom"
import { FirebaseProvider } from "@/components/providers/firebase-provider"

export function ListLayout() {
  const { listId } = useParams<{ listId: string }>()
  
  if (!listId) {
    return <div>Invalid list ID</div>
  }
  
  return (
    <FirebaseProvider listId={listId}>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b">
          <div className="container mx-auto p-4">
            <h1 className="text-xl font-semibold">Shopping Planner</h1>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </FirebaseProvider>
  )
}
