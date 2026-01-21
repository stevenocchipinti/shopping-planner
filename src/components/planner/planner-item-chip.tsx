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

export function PlannerItemChip({
  item,
  emoji,
  displayName,
  onClick,
}: PlannerItemChipProps) {
  const longPressHandlers = useLongPress({
    onLongPress: onClick,
    delay: 300,
  })

  return (
    <button
      type="button"
      className={cn(
        // Use same pill-style as ItemChip for consistency
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all select-none",
        "border border-border bg-background shadow-sm",
        "hover:bg-accent/50 active:scale-95",
        // Recipe items have a subtle accent
        item.type === "recipe" && "border-primary/30 bg-primary/5"
      )}
      {...longPressHandlers}
    >
      {emoji && <Emoji id={emoji} size={16} />}
      <span className="truncate">{displayName}</span>
    </button>
  )
}
