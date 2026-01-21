import { useRef, useMemo } from "react"
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
  type PlannerItemFormData,
} from "@/components/form/planner-item-form"
import { useFirebaseContext } from "@/components/providers/firebase-provider"
import { Trash2 } from "lucide-react"
import type { DayOfWeek, PlannerItem } from "@/types"

interface EditPlannerItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  day: DayOfWeek
  item: PlannerItem
}

export function EditPlannerItemDialog({
  open,
  onOpenChange,
  day,
  item,
}: EditPlannerItemDialogProps) {
  const { catalogue, recipes, planner, backend } = useFirebaseContext()
  const formRef = useRef<PlannerItemFormRef>(null)

  // Get initial values from the item
  const initialData = useMemo((): PlannerItemFormData => {
    const displayName = item.name
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase())

    // Get emoji from recipe or catalogue
    let emoji: string | null = null
    if (item.type === "recipe" && recipes[item.name]) {
      emoji = recipes[item.name].emoji
    } else if (catalogue[item.name]) {
      emoji = catalogue[item.name].emoji
    }

    // Get ingredients if it's a recipe
    const ingredients =
      item.type === "recipe" && recipes[item.name]
        ? recipes[item.name].ingredients.map(i => {
            const catalogueEntry = catalogue[i.slug]
            return {
              value: i.slug,
              label: i.slug
                .replace(/-/g, " ")
                .replace(/\b\w/g, c => c.toUpperCase()),
              emoji: catalogueEntry?.emoji || null,
            }
          })
        : []

    return {
      itemName: displayName,
      selectedDay: day,
      emoji,
      ingredients,
    }
  }, [item, day, recipes, catalogue])

  const handleDelete = async () => {
    await backend.deleteFromPlannerDay(day, item.name, planner)
    onOpenChange(false)
  }

  const handleSave = async () => {
    const formData = formRef.current?.getData()
    if (!formData) return

    const trimmedName = formData.itemName.trim()
    if (!trimmedName) return

    // Determine if it's a recipe based on ingredients
    const isRecipe = formData.ingredients.length > 0
    const ingredientList = isRecipe
      ? formData.ingredients.map(i => i.label)
      : undefined

    // Check if anything changed
    const dayChanged = formData.selectedDay !== day
    const nameChanged =
      trimmedName.toLowerCase().replace(/\s+/g, "-") !== item.name
    const typeChanged = isRecipe !== (item.type === "recipe")

    // Check if ingredients changed
    const originalIngredients =
      item.type === "recipe" && recipes[item.name]
        ? recipes[item.name].ingredients.map(i => i.slug).sort()
        : []
    const newIngredients = formData.ingredients.map(i => i.value).sort()
    const ingredientsChanged =
      JSON.stringify(originalIngredients) !== JSON.stringify(newIngredients)

    const hasChanges =
      dayChanged || nameChanged || typeChanged || ingredientsChanged

    if (!hasChanges) {
      onOpenChange(false)
      return
    }

    // Remove from current day
    await backend.deleteFromPlannerDay(day, item.name, planner)

    // Add to the (potentially new) day with updated data
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

  // Use item.name + day as key to force form reset when editing different items
  const formKey = `${item.name}-${day}`

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-md mx-auto">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Edit Planner Item</DrawerTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete item</span>
            </Button>
          </div>
        </DrawerHeader>
        <div className="space-y-4 px-4">
          <PlannerItemForm
            key={formKey}
            ref={formRef}
            initialData={initialData}
            catalogue={catalogue}
            recipes={recipes}
            mode="edit"
          />

          <DrawerFooter className="flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} className="flex-1">
              Save
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
