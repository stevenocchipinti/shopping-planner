import { cn } from "@/lib/utils"
import type { PlannerItem } from "@/types"

interface PlannerItemChipProps {
  item: PlannerItem
  emoji: string | null
  displayName: string
  onClick: () => void
}

export function PlannerItemChip({ item, emoji, displayName, onClick }: PlannerItemChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all select-none",
        "border border-border bg-background shadow-sm",
        "hover:bg-accent/50 active:scale-95",
        item.type === "recipe" && "border-primary/30 bg-primary/5"
      )}
    >
      {emoji && (
        <span className="text-base" role="img" aria-hidden="true">
          {emoji}
        </span>
      )}
      <span>{displayName}</span>
      {item.type === "recipe" && (
        <span className={cn(
          "ml-0.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs",
          "bg-primary/10 text-primary"
        )}>
          recipe
        </span>
      )}
    </button>
  )
}
