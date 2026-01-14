import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { PlannerItemChip } from "./planner-item-chip"
import { Button } from "@/components/ui/button"
import type { PlannerItem, CatalogueEntry, Recipe, DayOfWeek } from "@/types"

interface PlannerDayColumnProps {
  day: DayOfWeek
  dayLabel: string
  items: PlannerItem[]
  catalogue: Record<string, CatalogueEntry>
  recipes: Record<string, Recipe>
  onAddClick: (day: DayOfWeek) => void
  onItemClick: (day: DayOfWeek, item: PlannerItem) => void
}

export function PlannerDayColumn({
  day,
  dayLabel,
  items,
  catalogue,
  recipes,
  onAddClick,
  onItemClick,
}: PlannerDayColumnProps) {
  // Get display name and emoji for an item
  const getItemDetails = (item: PlannerItem) => {
    // Check recipes first for recipe type
    if (item.type === "recipe" && recipes[item.name]) {
      return {
        displayName: item.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        emoji: recipes[item.name].emoji,
      }
    }
    
    // Check catalogue
    const catalogueEntry = catalogue[item.name]
    return {
      displayName: item.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      emoji: catalogueEntry?.emoji || null,
    }
  }

  const isEmpty = items.length === 0

  return (
    <div className="flex flex-col min-w-[140px] flex-1">
      {/* Day header */}
      <div className={cn(
        "py-2 px-3 text-center font-semibold text-sm border-b",
        "bg-muted/50"
      )}>
        {dayLabel}
      </div>

      {/* Items container */}
      <div className="flex-1 p-2 space-y-2 min-h-[120px]">
        {isEmpty ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No plans
          </p>
        ) : (
          items.map((item, index) => {
            const { displayName, emoji } = getItemDetails(item)
            return (
              <PlannerItemChip
                key={`${item.name}-${index}`}
                item={item}
                emoji={emoji}
                displayName={displayName}
                onClick={() => onItemClick(day, item)}
              />
            )
          })
        )}
      </div>

      {/* Add button at bottom */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-8"
          onClick={() => onAddClick(day)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  )
}
