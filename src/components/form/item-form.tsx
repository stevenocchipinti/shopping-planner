import {
  useState,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import { Label } from "@/components/ui/label"
import { Autocomplete } from "@/components/form/autocomplete"
import { NumberPicker } from "@/components/form/number-picker"
import { EmojiPicker } from "@/components/ui/emoji-picker"
import { useFirebaseContext } from "@/contexts/firebase-context"
import { slugify } from "@/lib/slugify"
import { searchEmoji } from "@/lib/emoji/emoji-search"
import type { ItemWithMetadata, CatalogueEntry } from "@/types"

interface ItemFormProps {
  initialItem?: ItemWithMetadata | null
  mode: "add" | "edit"
  onStateChange?: () => void
}

export interface ItemFormData {
  name: string
  section: string
  quantity: number
  emoji: string | null
}

export interface ItemFormHandle {
  getData: () => ItemFormData
  isValid: () => boolean
  getButtonState: () => { label: string; disabled: boolean; action?: string }
}

export const ItemForm = forwardRef<ItemFormHandle, ItemFormProps>(
  ({ initialItem, mode, onStateChange }, ref) => {
    const { items, catalogue } = useFirebaseContext()
    const inputRef = useRef<HTMLInputElement>(null)

    const [itemName, setItemName] = useState(initialItem?.name || "")
    const [section, setSection] = useState(initialItem?.section || "")
    const [quantity, setQuantity] = useState(initialItem?.quantity || 1)
    // Normalize emoji: treat empty string as null for consistent comparison
    const normalizeEmoji = (e: string | null | undefined): string | null =>
      e === "" || e === undefined ? null : e
    const [emoji, setEmoji] = useState<string | null>(
      normalizeEmoji(initialItem?.emoji)
    )
    const [userSelectedEmoji, setUserSelectedEmoji] = useState(false)

    // Auto-focus input after mount
    useEffect(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }, [])

    // Auto-select emoji when item name changes (add mode only)
    useEffect(() => {
      if (mode !== "add") return
      if (!itemName.trim() || userSelectedEmoji) return

      const autoSelectEmoji = async () => {
        const result = await searchEmoji(itemName)
        setEmoji(result)
      }

      const timer = setTimeout(autoSelectEmoji, 300)
      return () => clearTimeout(timer)
    }, [itemName, userSelectedEmoji, mode])

    // Handle user emoji selection from picker
    const handleEmojiChange = (newEmoji: string | null) => {
      setEmoji(newEmoji)
      setUserSelectedEmoji(true)
    }

    // Create autocomplete options from catalogue (for add mode)
    const itemOptions = useMemo(() => {
      if (mode !== "add") return []
      return Object.entries(catalogue).map(([slug, entry]) => ({
        value: slug,
        label: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        emoji: entry.emoji,
      }))
    }, [catalogue, mode])

    const sectionOptions = useMemo(() => {
      const sections = new Set(
        Object.values(catalogue)
          .map(entry => entry.section)
          .filter(Boolean)
      )
      return Array.from(sections).map(s => ({
        value: s,
        label: s,
      }))
    }, [catalogue])

    // Handle item selection from autocomplete (add mode only)
    const handleItemSelect = (option: {
      value: string
      emoji?: string | null
    }) => {
      if (mode !== "add") return
      const catalogueEntry = catalogue[option.value]
      if (catalogueEntry) {
        setSection(catalogueEntry.section || "")
        setEmoji(catalogueEntry.emoji)
      }
    }

    // Determine button state for add mode
    const addModeButtonState = useMemo(() => {
      const trimmedName = itemName.trim()

      if (!trimmedName) {
        return { label: "Add", disabled: true, action: "none" }
      }

      const slug = slugify(trimmedName)
      const existingItem = items.find(item => slugify(item.name) === slug)
      const catalogueEntry = catalogue[slug] as CatalogueEntry | undefined

      if (!existingItem) {
        return { label: "Add", disabled: false, action: "add" }
      }

      // Item exists
      const existingSection = catalogueEntry?.section || ""
      const sectionChanged = section !== existingSection
      const quantityChanged = quantity !== existingItem.quantity

      if (existingItem.done) {
        return { label: "Uncheck", disabled: false, action: "uncheck" }
      }

      if (sectionChanged) {
        return { label: "Move", disabled: false, action: "move" }
      }

      if (quantityChanged) {
        return { label: "Update", disabled: false, action: "update" }
      }

      return { label: "Already exists!", disabled: true, action: "none" }
    }, [itemName, section, quantity, items, catalogue])

    // Determine button state for edit mode
    const editModeButtonState = useMemo(() => {
      if (!initialItem) {
        return { label: "Save", disabled: true }
      }

      const trimmedName = itemName.trim()

      if (!trimmedName) {
        return { label: "Save", disabled: true }
      }

      // Check for name conflicts
      const newSlug = slugify(trimmedName)
      const oldSlug = initialItem.slug

      if (newSlug !== oldSlug) {
        const nameConflict = items.some(i => slugify(i.name) === newSlug)
        if (nameConflict) {
          return { label: "Already exists!", disabled: true }
        }
      }

      // Check if there are changes (normalize emoji for comparison)
      const hasChanges =
        trimmedName !== initialItem.name ||
        section !== (initialItem.section || "") ||
        quantity !== initialItem.quantity ||
        emoji !== normalizeEmoji(initialItem.emoji)

      if (!hasChanges) {
        return { label: "Save", disabled: true }
      }

      return { label: "Save", disabled: false }
    }, [initialItem, itemName, section, quantity, emoji, items])

    const buttonState =
      mode === "add" ? addModeButtonState : editModeButtonState

    // Expose methods to parent component
    useImperativeHandle(
      ref,
      () => ({
        getData: () => ({
          name: itemName.trim(),
          section,
          quantity,
          emoji,
        }),
        isValid: () => !buttonState.disabled,
        getButtonState: () => buttonState,
      }),
      [itemName, section, quantity, emoji, buttonState]
    )
    
    // Notify parent when button state changes
    useEffect(() => {
      onStateChange?.()
    }, [buttonState, onStateChange])

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="item">Item</Label>
          <Autocomplete
            inputRef={inputRef}
            value={itemName}
            onChange={setItemName}
            onSelect={handleItemSelect}
            options={itemOptions}
            placeholder="Enter item name..."
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
          <Label htmlFor="section">Section</Label>
          <Autocomplete
            value={section}
            onChange={setSection}
            options={sectionOptions}
            placeholder="Enter section (optional)..."
          />
        </div>

        <div className="space-y-2">
          <Label>Quantity</Label>
          <NumberPicker value={quantity} onChange={setQuantity} />
        </div>
      </div>
    )
  }
)

ItemForm.displayName = "ItemForm"
