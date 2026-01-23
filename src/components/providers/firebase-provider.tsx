import { type ReactNode } from "react"
import { useListData } from "@/hooks/use-list-data"
import { FirebaseContext } from "@/contexts/firebase-context"

export function FirebaseProvider({
  listId,
  children,
}: {
  listId: string
  children: ReactNode
}) {
  const data = useListData(listId)

  return (
    <FirebaseContext.Provider value={data}>{children}</FirebaseContext.Provider>
  )
}
