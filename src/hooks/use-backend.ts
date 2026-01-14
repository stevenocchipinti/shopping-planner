import { useContext } from "react"
import { FirebaseContext } from "@/components/providers/firebase-provider"

export function useBackend() {
  const context = useContext(FirebaseContext)
  
  if (!context) {
    throw new Error("useBackend must be used within FirebaseProvider")
  }
  
  return context.backend
}
