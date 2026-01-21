import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { generateListId } from "@/lib/firestore"

export function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    const listName = localStorage.getItem("listName")

    if (listName) {
      navigate(`/list/${listName}`)
    } else {
      const newListId = generateListId()
      localStorage.setItem("listName", newListId)
      navigate(`/list/${newListId}`)
    }
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Shopping Planner</h1>
        <p className="text-muted-foreground">Loading your list...</p>
      </div>
    </div>
  )
}
