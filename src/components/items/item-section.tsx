import { cn } from "@/lib/utils"
import { ItemChip } from "./item-chip"
import type { ItemWithMetadata } from "@/types"

interface ItemSectionProps {
  section: string
  items: ItemWithMetadata[]
  onToggleItem: (item: ItemWithMetadata) => void
  onEditItem: (item: ItemWithMetadata) => void
}

export function ItemSection({ section, items, onToggleItem, onEditItem }: ItemSectionProps) {
  const allDone = items.every((item) => item.done)
  const displayName = section || "Unsorted"

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-3 shadow-sm transition-opacity",
        allDone && "opacity-60"
      )}
    >
      <h3 className={cn(
        "mb-2 text-sm font-semibold text-muted-foreground",
        allDone && "line-through"
      )}>
        {displayName}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <ItemChip
            key={item.slug}
            item={item}
            onToggle={() => onToggleItem(item)}
            onEdit={() => onEditItem(item)}
          />
        ))}
      </div>
    </div>
  )
}
