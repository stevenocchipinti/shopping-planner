import { useRef } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {
  PlannerItemForm,
  type PlannerItemFormRef,
} from "@/components/form/planner-item-form"
import { useFirebaseContext } from "@/components/providers/firebase-provider"
import type { DayOfWeek } from "@/types"

interface AddPlannerItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDay: DayOfWeek
}

export function AddPlannerItemDialog({
  open,
  onOpenChange,
  defaultDay,
}: AddPlannerItemDialogProps) {
  const { catalogue, recipes, planner, backend } = useFirebaseContext()
  const formRef = useRef<PlannerItemFormRef>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = formRef.current?.getData()
    if (!formData || !formRef.current?.isValid()) return

    const trimmedName = formData.itemName.trim()
    if (!trimmedName) return

    // Determine if it's a recipe based on ingredients
    const isRecipe = formData.ingredients.length > 0
    const ingredientList = isRecipe
      ? formData.ingredients.map(i => i.label)
      : undefined

    await backend.addToPlannerDay(
      formData.selectedDay,
      trimmedName,
      isRecipe ? "recipe" : "item",
      planner,
      formData.emoji,
      ingredientList
    )

    onOpenChange(false)
  }

  // Use a key based on open state and defaultDay to reset the form
  const formKey = open ? `add-${defaultDay}-${Date.now()}` : "closed"

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle>Add to Planner</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          {open && (
            <PlannerItemForm
              key={formKey}
              ref={formRef}
              initialData={{
                itemName: "",
                selectedDay: defaultDay,
                emoji: null,
                ingredients: [],
              }}
              catalogue={catalogue}
              recipes={recipes}
              mode="add"
            />
          )}

          <DrawerFooter className="flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
