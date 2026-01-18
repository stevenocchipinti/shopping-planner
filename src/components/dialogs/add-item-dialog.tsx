import { useState, useMemo, useEffect } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Autocomplete } from "@/components/form/autocomplete"
import { NumberPicker } from "@/components/form/number-picker"
import { EmojiPicker } from "@/components/ui/emoji-picker"
import { useFirebaseContext } from "@/components/providers/firebase-provider"
import { slugify } from "@/lib/slugify"
import { searchEmoji } from "@/lib/emoji/emoji-search"
import type { CatalogueEntry } from "@/types"

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ButtonState = {
  label: string
  disabled: boolean
  action: "add" | "move" | "update" | "uncheck" | "none"
}

export function AddItemDialog({ open, onOpenChange }: AddItemDialogProps) {
  const { items, catalogue, backend } = useFirebaseContext()

  const [itemName, setItemName] = useState("")
  const [section, setSection] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [emoji, setEmoji] = useState<string | null>(null)
  const [userSelectedEmoji, setUserSelectedEmoji] = useState(false)

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setItemName("")
      setSection("")
      setQuantity(1)
      setEmoji(null)
      setUserSelectedEmoji(false)
    }
  }, [open])

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

  // Create autocomplete options from catalogue
  const itemOptions = useMemo(() => {
    return Object.entries(catalogue).map(([slug, entry]) => ({
      value: slug,
      label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), // prettify
      emoji: entry.emoji,
    }))
  }, [catalogue])

  const sectionOptions = useMemo(() => {
    const sections = new Set(
      Object.values(catalogue)
        .map((entry) => entry.section)
        .filter(Boolean)
    )
    return Array.from(sections).map((s) => ({
      value: s,
      label: s,
    }))
  }, [catalogue])

  // Handle item selection from autocomplete
  const handleItemSelect = (option: { value: string; emoji?: string | null }) => {
    const catalogueEntry = catalogue[option.value]
    if (catalogueEntry) {
      setSection(catalogueEntry.section || "")
      setEmoji(catalogueEntry.emoji)
    }
  }

  // Determine button state based on form values
  const buttonState = useMemo((): ButtonState => {
    const trimmedName = itemName.trim()
    
    if (!trimmedName) {
      return { label: "Add", disabled: true, action: "none" }
    }

    const slug = slugify(trimmedName)
    const existingItem = items.find((item) => slugify(item.name) === slug)
    const catalogueEntry = catalogue[slug] as CatalogueEntry | undefined

    if (!existingItem) {
      // New item
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedName = itemName.trim()
    if (!trimmedName || buttonState.disabled) return

    const slug = slugify(trimmedName)
    const existingItem = items.find((item) => slugify(item.name) === slug)

    switch (buttonState.action) {
      case "add":
      case "move":
      case "update":
        await backend.addItem(trimmedName, section, quantity, emoji)
        break
      case "uncheck":
        if (existingItem) {
          await backend.toggleItemDone(existingItem.name, existingItem.done)
        }
        break
    }

    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
      <DrawerContent className="sm:max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle>Add Item</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <div className="space-y-2">
            <Label htmlFor="item">Item</Label>
            <Autocomplete
              value={itemName}
              onChange={setItemName}
              onSelect={handleItemSelect}
              options={itemOptions}
              placeholder="Enter item name..."
              autoFocus
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

          <DrawerFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={buttonState.disabled}>
              {buttonState.label}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
