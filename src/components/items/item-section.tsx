import { cn } from "@/lib/utils"
import { ItemChip } from "./item-chip"
import type { ItemWithMetadata } from "@/types"

interface ItemSectionProps {
  section: string
  items: ItemWithMetadata[]
  onToggleItem: (item: ItemWithMetadata) => void
  onEditItem: (item: ItemWithMetadata) => void
}

export function ItemSection({
  section,
  items,
  onToggleItem,
  onEditItem,
}: ItemSectionProps) {
  const allDone = items.every(item => item.done)

  // Capitalize section name for display
  const displaySection = section
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-3 shadow-sm transition-opacity",
        allDone && "opacity-60"
      )}
    >
      {section && (
        <h3
          className={cn(
            "mb-2 text-sm font-semibold text-muted-foreground",
            allDone && "line-through"
          )}
        >
          {displaySection}
        </h3>
      )}
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
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
