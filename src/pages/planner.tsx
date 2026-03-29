import { useState } from "react"
import { useFirebaseContext } from "@/contexts/firebase-context"
import { PlannerDayColumn } from "@/components/planner/planner-day-column"
import { AddPlannerItemDialog } from "@/components/dialogs/add-planner-item-dialog"
import { EditPlannerItemDialog } from "@/components/dialogs/edit-planner-item-dialog"
import { DAYS } from "@/components/form/day-picker"
import type { DayOfWeek, PlannerItem } from "@/types"

export function PlannerPage() {
  const { planner, catalogue, recipes, loading } = useFirebaseContext()

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addDialogDay, setAddDialogDay] = useState<DayOfWeek>("Monday")

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<{
    day: DayOfWeek
    item: PlannerItem
  } | null>(null)

  const handleAddClick = (day: DayOfWeek) => {
    setAddDialogDay(day)
    setAddDialogOpen(true)
  }

  const handleItemClick = (day: DayOfWeek, item: PlannerItem) => {
    setEditItem({ day, item })
    setEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading planner...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      {/* Mobile: compact row layout matching prod, Desktop: column layout */}
      <div className="flex flex-col gap-px rounded-xl border bg-card shadow-sm overflow-hidden md:flex-row md:gap-2 md:rounded-none md:border-0 md:bg-transparent md:shadow-none md:overflow-x-auto">
        {DAYS.map(day => (
          <PlannerDayColumn
            key={day.value}
            day={day.value}
            dayLabel={day.label}
            items={planner[day.value]?.items || []}
            catalogue={catalogue}
            recipes={recipes}
            onAddClick={handleAddClick}
            onItemClick={handleItemClick}
          />
        ))}
      </div>

      {/* Add Planner Item Dialog */}
      <AddPlannerItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        defaultDay={addDialogDay}
      />

      {/* Edit Planner Item Dialog */}
      {editItem && (
        <EditPlannerItemDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          day={editItem.day}
          item={editItem.item}
        />
      )}
    </div>
  )
}
