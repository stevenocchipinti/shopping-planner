import { useState, useMemo, useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { Label } from "@/components/ui/label"
import { Autocomplete } from "@/components/form/autocomplete"
import { MultiAutocomplete } from "@/components/form/multi-autocomplete"
import { DayPicker } from "@/components/form/day-picker"
import { EmojiPicker } from "@/components/ui/emoji-picker"
import { searchEmoji } from "@/lib/emoji/emoji-search"
import type { DayOfWeek, CatalogueData, RecipesData } from "@/types"

interface SelectedIngredient {
  value: string
  label: string
  emoji?: string | null
}

export interface PlannerItemFormData {
  itemName: string
  selectedDay: DayOfWeek
  emoji: string | null
  ingredients: SelectedIngredient[]
}

export interface PlannerItemFormRef {
  getData: () => PlannerItemFormData
  isValid: () => boolean
}

interface PlannerItemFormProps {
  initialData: PlannerItemFormData
  catalogue: CatalogueData
  recipes: RecipesData
  mode: "add" | "edit"
}

export const PlannerItemForm = forwardRef<PlannerItemFormRef, PlannerItemFormProps>(
  function PlannerItemForm({ initialData, catalogue, recipes, mode }, ref) {
    const [itemName, setItemName] = useState(initialData.itemName)
    const [selectedDay, setSelectedDay] = useState<DayOfWeek>(initialData.selectedDay)
    const [emoji, setEmoji] = useState<string | null>(initialData.emoji)
    const [userSelectedEmoji, setUserSelectedEmoji] = useState(mode === "edit" && initialData.emoji !== null)
    const [ingredients, setIngredients] = useState<SelectedIngredient[]>(initialData.ingredients)
    
    const itemInputRef = useRef<HTMLInputElement>(null)

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      getData: () => ({
        itemName,
        selectedDay,
        emoji,
        ingredients,
      }),
      isValid: () => itemName.trim().length > 0,
    }), [itemName, selectedDay, emoji, ingredients])

    // Focus the item input when the form mounts (after day picker)
    useEffect(() => {
      // Small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        itemInputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }, [])

    // Auto-select emoji when item name changes (only in add mode or if user hasn't selected)
    useEffect(() => {
      if (!itemName.trim() || userSelectedEmoji) return

      const autoSelectEmoji = async () => {
        const result = await searchEmoji(itemName)
        setEmoji(result)
      }

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
      const combined = new Map<string, (typeof catalogueItems)[0]>()
      catalogueItems.forEach((item) => combined.set(item.value, item))
      recipeItems.forEach((item) => combined.set(item.value, item))

      return Array.from(combined.values())
    }, [catalogue, recipes])

    // Create ingredient options from catalogue
    const ingredientOptions = useMemo(() => {
      return Object.entries(catalogue).map(([slug, entry]) => ({
        value: slug,
        label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        emoji: entry.emoji,
      }))
    }, [catalogue])

    // Handle item selection from autocomplete
    const handleItemSelect = (option: {
      value: string
      emoji?: string | null
      isRecipe?: boolean
    }) => {
      const recipeEntry = recipes[option.value]

      if (recipeEntry) {
        setEmoji(recipeEntry.emoji)
        setUserSelectedEmoji(true)
        // Pre-fill ingredients from existing recipe
        const recipeIngredients = recipeEntry.ingredients.map((i) => {
          const catalogueEntry = catalogue[i.slug]
          return {
            value: i.slug,
            label: i.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            emoji: catalogueEntry?.emoji || null,
          }
        })
        setIngredients(recipeIngredients)
      } else {
        const catalogueEntry = catalogue[option.value]
        if (catalogueEntry) {
          setEmoji(catalogueEntry.emoji)
          setUserSelectedEmoji(true)
        }
        setIngredients([])
      }
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Day</Label>
          <DayPicker value={selectedDay} onChange={setSelectedDay} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="item">Item or Recipe</Label>
          <Autocomplete
            value={itemName}
            onChange={setItemName}
            onSelect={handleItemSelect}
            options={itemOptions}
            placeholder="Enter item or recipe name..."
            inputRef={itemInputRef}
            startAdornment={
              <EmojiPicker
                value={emoji}
                onChange={handleEmojiChange}
                variant="inline"
              />
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ingredients">Ingredients</Label>
          <MultiAutocomplete
            value={ingredients}
            onChange={setIngredients}
            options={ingredientOptions}
            placeholder="Add ingredients..."
          />
          <p className="text-xs text-muted-foreground">
            Add ingredients to make this a recipe. Leave empty for a single item.
          </p>
        </div>
      </div>
    )
  }
)
