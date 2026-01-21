// Day of the week
// CRITICAL: Must use capitalized day names for backward compatibility with old app
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"

// Item in the planner
export interface PlannerItem {
  type: "item" | "recipe"
  name: string // slug reference
}

// Planner day document
export interface PlannerDay {
  items: PlannerItem[]
}

// Planner data keyed by day
export type PlannerData = Record<DayOfWeek, PlannerDay>
