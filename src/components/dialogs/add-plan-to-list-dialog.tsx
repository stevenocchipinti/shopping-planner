import { useState, useEffect } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Emoji } from "@/components/ui/emoji"
import { useFirebaseContext } from "@/contexts/firebase-context"
import { Check, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddPlanToListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ExtractedItem {
  slug: string
  displayName: string
  emoji: string | null
  section: string
  quantity: number
  checked: boolean
}

export function AddPlanToListDialog({
  open,
  onOpenChange,
}: AddPlanToListDialogProps) {
  const { planner, recipes, catalogue, backend } = useFirebaseContext()

  const [items, setItems] = useState<ExtractedItem[]>([])
  const [submitting, setSubmitting] = useState(false)

  // Extract all ingredients from planner when dialog opens
  useEffect(() => {
    if (!open) return

    // Collect all items from all days
    const itemCounts = new Map<
      string,
      {
        slug: string
        displayName: string
        emoji: string | null
        section: string
        count: number
      }
    >()

    Object.values(planner).forEach(day => {
      if (!day.items) return

      day.items.forEach(plannerItem => {
        if (plannerItem.type === "recipe") {
          // Expand recipe into ingredients
          const recipe = recipes[plannerItem.name]
          if (recipe?.ingredients) {
            recipe.ingredients.forEach(ing => {
              const existing = itemCounts.get(ing.slug)
              const catalogueEntry = catalogue[ing.slug]
              if (existing) {
                existing.count++
              } else {
                itemCounts.set(ing.slug, {
                  slug: ing.slug,
                  displayName: ing.slug
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, c => c.toUpperCase()),
                  emoji: catalogueEntry?.emoji || null,
                  section: catalogueEntry?.section || "",
                  count: 1,
                })
              }
            })
          }
        } else {
          // Simple item - add directly
          const existing = itemCounts.get(plannerItem.name)
          const catalogueEntry = catalogue[plannerItem.name]
          if (existing) {
            existing.count++
          } else {
            itemCounts.set(plannerItem.name, {
              slug: plannerItem.name,
              displayName: plannerItem.name
                .replace(/-/g, " ")
                .replace(/\b\w/g, c => c.toUpperCase()),
              emoji: catalogueEntry?.emoji || null,
              section: catalogueEntry?.section || "",
              count: 1,
            })
          }
        }
      })
    })

    // Convert to array with checked state
    const extractedItems: ExtractedItem[] = Array.from(itemCounts.values())
      .map(item => ({
        slug: item.slug,
        displayName: item.displayName,
        emoji: item.emoji,
        section: item.section,
        quantity: item.count,
        checked: true, // All checked by default
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName))

    setItems(extractedItems)
  }, [open, planner, recipes, catalogue])

  const toggleItem = (slug: string) => {
    setItems(prev =>
      prev.map(item =>
        item.slug === slug ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const toggleAll = () => {
    const allChecked = items.every(i => i.checked)
    setItems(prev => prev.map(item => ({ ...item, checked: !allChecked })))
  }

  const checkedCount = items.filter(i => i.checked).length
  const hasCheckedItems = checkedCount > 0

  const handleSubmit = async () => {
    const itemsToAdd = items
      .filter(item => item.checked)
      .map(item => ({
        name: item.displayName,
        quantity: item.quantity,
        section: item.section,
        emoji: item.emoji,
      }))

    if (itemsToAdd.length === 0) {
      onOpenChange(false)
      return
    }

    setSubmitting(true)
    try {
      await backend.addPlanToList(itemsToAdd)
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  const isEmpty = items.length === 0

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-md mx-auto max-h-[80vh] flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add Plan to Shopping List
          </DrawerTitle>
          <DrawerDescription>
            {isEmpty
              ? "No items to add. Add some items to your planner first."
              : "Select the items you want to add to your shopping list."}
          </DrawerDescription>
        </DrawerHeader>

        {!isEmpty && (
          <>
            <div className="flex items-center justify-between py-2 px-4 border-b">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleAll}
              >
                {items.every(i => i.checked) ? "Deselect All" : "Select All"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {checkedCount} of {items.length} selected
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1 min-h-[200px] max-h-[400px]">
              {items.map(item => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => toggleItem(item.slug)}
                  className={cn(
                    "flex items-center gap-3 w-full p-2 rounded-md text-left transition-colors",
                    "hover:bg-accent",
                    !item.checked && "opacity-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border",
                      item.checked
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border"
                    )}
                  >
                    {item.checked && <Check className="h-3 w-3" />}
                  </div>
                  {item.emoji && <Emoji id={item.emoji} size={18} />}
                  <span className="flex-1">{item.displayName}</span>
                  {item.quantity > 1 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      x{item.quantity}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        <DrawerFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!hasCheckedItems || submitting}
          >
            {submitting ? "Adding..." : `Add ${checkedCount} Items`}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
