import { cn } from "@/lib/utils"
import { useLongPress } from "@/hooks/use-long-press"
import type { ItemWithMetadata } from "@/types"

interface ItemChipProps {
  item: ItemWithMetadata
  onToggle: () => void
  onEdit: () => void
}

export function ItemChip({ item, onToggle, onEdit }: ItemChipProps) {
  const longPressHandlers = useLongPress({
    onLongPress: onEdit,
    onClick: onToggle,
    delay: 300,
  })

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all select-none",
        "border border-border bg-background shadow-sm",
        "hover:bg-accent/50 active:scale-95",
        item.done && "opacity-60 line-through decoration-muted-foreground"
      )}
      {...longPressHandlers}
    >
      {item.emoji && (
        <span className="text-base" role="img" aria-hidden="true">
          {item.emoji}
        </span>
      )}
      <span>{item.name}</span>
      {item.quantity > 1 && (
        <span className={cn(
          "ml-0.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold",
          "bg-primary/10 text-primary"
        )}>
          x{item.quantity}
        </span>
      )}
    </button>
  )
}
