import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Emoji } from "@/components/ui/emoji"
import { DayPicker } from "@/components/form/day-picker"
import { useFirebaseContext } from "@/components/providers/firebase-provider"
import { Trash2 } from "lucide-react"
import type { DayOfWeek, PlannerItem } from "@/types"

interface EditPlannerItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  day: DayOfWeek
  item: PlannerItem
}

export function EditPlannerItemDialog({ open, onOpenChange, day, item }: EditPlannerItemDialogProps) {
  const { catalogue, recipes, planner, backend } = useFirebaseContext()

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(day)
  const [emoji, setEmoji] = useState<string | null>(null)

  // Get display name
  const displayName = item.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedDay(day)
      
      // Get emoji from recipe or catalogue
      if (item.type === "recipe" && recipes[item.name]) {
        setEmoji(recipes[item.name].emoji)
      } else if (catalogue[item.name]) {
        setEmoji(catalogue[item.name].emoji)
      } else {
        setEmoji(null)
      }
    }
  }, [open, day, item, recipes, catalogue])

  const handleDelete = async () => {
    await backend.deleteFromPlannerDay(day, item.name, planner)
    onOpenChange(false)
  }

  const handleMoveToDay = async () => {
    if (selectedDay === day) {
      onOpenChange(false)
      return
    }

    // Remove from current day
    await backend.deleteFromPlannerDay(day, item.name, planner)
    
    // Add to new day
    await backend.addToPlannerDay(
      selectedDay,
      displayName,
      item.type,
      planner,
      emoji
    )
    
    onOpenChange(false)
  }

  const hasDayChanged = selectedDay !== day

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Planner Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Item</Label>
            <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
              {emoji && (
                <Emoji id={emoji} size={24} />
              )}
              <span className="font-medium">{displayName}</span>
              {item.type === "recipe" && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  recipe
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Move to Day</Label>
            <DayPicker value={selectedDay} onChange={setSelectedDay} />
          </div>

          {item.type === "recipe" && recipes[item.name] && (
            <div className="space-y-2">
              <Label>Ingredients</Label>
              <div className="p-3 border rounded-md bg-muted/50">
                <ul className="text-sm text-muted-foreground">
                  {recipes[item.name].ingredients.map((ing, index) => (
                    <li key={index}>
                      {ing.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="sm:mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleMoveToDay}
              disabled={!hasDayChanged}
            >
              {hasDayChanged ? "Move" : "Done"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
