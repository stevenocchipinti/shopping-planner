import { ShoppingCart } from "lucide-react"

const MESSAGES = [
  "Empty list",
  "Nothing to buy!",
  "All done!",
  "Have a great day",
  "Time to relax",
]

export function EmptyState() {
  // Pick a random message on each render
  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
      <p className="mt-1 text-sm text-muted-foreground/70">
        Tap the + button to add items
      </p>
    </div>
  )
}
