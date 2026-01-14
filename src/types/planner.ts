// Day of the week
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

// Item in the planner
export interface PlannerItem {
  type: "item" | "recipe"
  name: string  // slug reference
}

// Planner day document
export interface PlannerDay {
  items: PlannerItem[]
}

// Planner data keyed by day
export type PlannerData = Record<DayOfWeek, PlannerDay>
