import { cn } from "@/lib/utils"
import { useLongPress } from "@/hooks/use-long-press"
import { Emoji } from "@/components/ui/emoji"
import type { PlannerItem } from "@/types"

interface PlannerItemChipProps {
  item: PlannerItem
  emoji: string | null
  displayName: string
  onClick: () => void
}

export function PlannerItemChip({ item, emoji, displayName, onClick }: PlannerItemChipProps) {
  const longPressHandlers = useLongPress({
    onLongPress: onClick,
    delay: 300,
  })

  return (
    <button
      type="button"
      className={cn(
        "w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all select-none",
        "border border-border bg-background shadow-sm",
        "hover:bg-accent/50 active:scale-[0.98]",
        "min-h-[44px]", // Consistent minimum height
        item.type === "recipe" && "border-primary/30 bg-primary/5"
      )}
      {...longPressHandlers}
    >
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {emoji ? (
          <Emoji id={emoji} size={20} />
        ) : (
          <span className="w-5 h-5 rounded-full bg-muted" />
        )}
      </span>
      <span className="flex-1 text-left truncate">{displayName}</span>
    </button>
  )
}
