import { useState, useMemo, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Autocomplete } from "@/components/form/autocomplete"
import { DayPicker } from "@/components/form/day-picker"
import { EmojiPicker } from "@/components/ui/emoji-picker"
import { useFirebaseContext } from "@/components/providers/firebase-provider"
import { searchEmoji } from "@/lib/emoji/emoji-search"
import type { DayOfWeek } from "@/types"

interface AddPlannerItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDay: DayOfWeek
}

export function AddPlannerItemDialog({ open, onOpenChange, defaultDay }: AddPlannerItemDialogProps) {
  const { catalogue, recipes, planner, backend } = useFirebaseContext()

  const [itemName, setItemName] = useState("")
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(defaultDay)
  const [emoji, setEmoji] = useState<string | null>(null)
  const [userSelectedEmoji, setUserSelectedEmoji] = useState(false)
  const [isRecipe, setIsRecipe] = useState(false)
  const [ingredients, setIngredients] = useState("")

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setItemName("")
      setSelectedDay(defaultDay)
      setEmoji(null)
      setUserSelectedEmoji(false)
      setIsRecipe(false)
      setIngredients("")
    }
  }, [open, defaultDay])

  // Auto-select emoji when item name changes
  useEffect(() => {
    // Don't override if user manually selected an emoji
    if (!itemName.trim() || userSelectedEmoji) return

    const autoSelectEmoji = async () => {
      const result = await searchEmoji(itemName)
      setEmoji(result)
    }

    // Debounce the search
    const timer = setTimeout(autoSelectEmoji, 300)
    return () => clearTimeout(timer)
  }, [itemName, userSelectedEmoji])

  // Handle user emoji selection from picker
  const handleEmojiChange = (newEmoji: string | null) => {
    setEmoji(newEmoji)
    setUserSelectedEmoji(true)
  }

  // Create autocomplete options from catalogue and recipes
  const itemOptions = useMemo(() => {
    const catalogueItems = Object.entries(catalogue).map(([slug, entry]) => ({
      value: slug,
      label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      emoji: entry.emoji,
      isRecipe: false,
    }))

    const recipeItems = Object.entries(recipes).map(([slug, recipe]) => ({
      value: slug,
      label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      emoji: recipe.emoji,
      isRecipe: true,
    }))

    // Combine and dedupe, preferring recipes
    const combined = new Map<string, typeof catalogueItems[0]>()
    catalogueItems.forEach((item) => combined.set(item.value, item))
    recipeItems.forEach((item) => combined.set(item.value, item))

    return Array.from(combined.values())
  }, [catalogue, recipes])

  // Handle item selection from autocomplete
  const handleItemSelect = (option: { value: string; emoji?: string | null; isRecipe?: boolean }) => {
    const catalogueEntry = catalogue[option.value]
    const recipeEntry = recipes[option.value]
    
    if (recipeEntry) {
      setEmoji(recipeEntry.emoji)
      setUserSelectedEmoji(true) // Treat selecting from catalogue as user selection
      setIsRecipe(true)
      // Pre-fill ingredients from existing recipe
      const ingredientList = recipeEntry.ingredients.map(i => 
        i.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      ).join(", ")
      setIngredients(ingredientList)
    } else if (catalogueEntry) {
      setEmoji(catalogueEntry.emoji)
      setUserSelectedEmoji(true) // Treat selecting from catalogue as user selection
      setIsRecipe(false)
      setIngredients("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedName = itemName.trim()
    if (!trimmedName) return

    // Parse ingredients if it's a recipe
    const ingredientList = isRecipe && ingredients.trim()
      ? ingredients.split(",").map(i => i.trim()).filter(Boolean)
      : undefined

    await backend.addToPlannerDay(
      selectedDay,
      trimmedName,
      isRecipe ? "recipe" : "item",
      planner,
      emoji,
      ingredientList
    )

    onOpenChange(false)
  }

  const isValid = itemName.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Planner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item">Item or Recipe</Label>
            <Autocomplete
              value={itemName}
              onChange={setItemName}
              onSelect={handleItemSelect}
              options={itemOptions}
              placeholder="Enter item or recipe name..."
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Day</Label>
            <DayPicker value={selectedDay} onChange={setSelectedDay} />
          </div>

          <div className="space-y-2">
            <Label>Emoji</Label>
            <EmojiPicker value={emoji} onChange={handleEmojiChange} />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRecipe"
              checked={isRecipe}
              onChange={(e) => setIsRecipe(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <Label htmlFor="isRecipe" className="font-normal cursor-pointer">
              This is a recipe (has ingredients)
            </Label>
          </div>

          {isRecipe && (
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
              <input
                id="ingredients"
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g., chicken, rice, broccoli"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <p className="text-xs text-muted-foreground">
                These ingredients will be added to your shopping list when you "Add Plan to List"
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
