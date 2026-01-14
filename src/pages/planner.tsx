import { useState } from "react"
import { useFirebaseContext } from "@/components/providers/firebase-provider"
import { PlannerDayColumn } from "@/components/planner/planner-day-column"
import { AddPlannerItemDialog } from "@/components/dialogs/add-planner-item-dialog"
import { EditPlannerItemDialog } from "@/components/dialogs/edit-planner-item-dialog"
import { DAYS } from "@/components/form/day-picker"
import type { DayOfWeek, PlannerItem } from "@/types"

export function PlannerPage() {
  const { planner, catalogue, recipes, loading } = useFirebaseContext()
  
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addDialogDay, setAddDialogDay] = useState<DayOfWeek>("monday")
  
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<{ day: DayOfWeek; item: PlannerItem } | null>(null)
  
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
      {/* Desktop: horizontal scroll, Mobile: vertical stack */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-0 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:divide-x border rounded-lg overflow-hidden bg-card min-w-full md:min-w-max">
          {DAYS.map((day) => (
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
