import { cn } from "@/lib/utils"
import type { DayOfWeek } from "@/types"

const DAYS: { value: DayOfWeek; label: string; short: string }[] = [
  { value: "monday", label: "Monday", short: "M" },
  { value: "tuesday", label: "Tuesday", short: "T" },
  { value: "wednesday", label: "Wednesday", short: "W" },
  { value: "thursday", label: "Thursday", short: "Th" },
  { value: "friday", label: "Friday", short: "F" },
  { value: "saturday", label: "Saturday", short: "Sa" },
  { value: "sunday", label: "Sunday", short: "Su" },
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
