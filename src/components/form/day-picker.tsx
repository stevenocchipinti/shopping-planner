import { cn } from "@/lib/utils"
import type { DayOfWeek } from "@/types"

const DAYS: { value: DayOfWeek; label: string; short: string }[] = [
  { value: "Monday", label: "Monday", short: "M" },
  { value: "Tuesday", label: "Tuesday", short: "T" },
  { value: "Wednesday", label: "Wednesday", short: "W" },
  { value: "Thursday", label: "Thursday", short: "Th" },
  { value: "Friday", label: "Friday", short: "F" },
  { value: "Saturday", label: "Saturday", short: "Sa" },
  { value: "Sunday", label: "Sunday", short: "Su" },
]

interface DayPickerProps {
  value: DayOfWeek | null
  onChange: (day: DayOfWeek) => void
  className?: string
}

export function DayPicker({ value, onChange, className }: DayPickerProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {DAYS.map((day) => (
        <button
          key={day.value}
          type="button"
          onClick={() => onChange(day.value)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
            "border border-border",
            value === day.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background hover:bg-accent"
          )}
          title={day.label}
        >
          {day.short}
        </button>
      ))}
    </div>
  )
}

// Export days array for use elsewhere
export { DAYS }
