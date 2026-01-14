import { useState, useMemo, useEffect } from "react"
import { Trash2 } from "lucide-react"
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
import { NumberPicker } from "@/components/form/number-picker"
import { useFirebaseContext } from "@/components/providers/firebase-provider"
import { slugify } from "@/lib/slugify"
import type { ItemWithMetadata } from "@/types"

interface EditItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ItemWithMetadata | null
}

export function EditItemDialog({ open, onOpenChange, item }: EditItemDialogProps) {
  const { items, catalogue, backend } = useFirebaseContext()

  const [itemName, setItemName] = useState("")
  const [section, setSection] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [emoji, setEmoji] = useState<string | null>(null)

  // Initialize form when dialog opens or item changes
  useEffect(() => {
    if (open && item) {
      setItemName(item.name)
      setSection(item.section)
      setQuantity(item.quantity)
      setEmoji(item.emoji)
    }
  }, [open, item])

  // Create autocomplete options from catalogue
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

  // Determine if there are changes
  const hasChanges = useMemo(() => {
    if (!item) return false
    return (
      itemName.trim() !== item.name ||
      section !== item.section ||
      quantity !== item.quantity ||
      emoji !== item.emoji
    )
  }, [item, itemName, section, quantity, emoji])

  // Check if the new name conflicts with an existing item
  const nameConflict = useMemo(() => {
    if (!item) return false
    const trimmedName = itemName.trim()
    const newSlug = slugify(trimmedName)
    const oldSlug = item.slug
    
    if (newSlug === oldSlug) return false
    
    return items.some((i) => slugify(i.name) === newSlug)
  }, [item, itemName, items])

  const buttonState = useMemo(() => {
    if (!itemName.trim()) {
      return { label: "Save", disabled: true }
    }
    if (nameConflict) {
      return { label: "Already exists!", disabled: true }
    }
    if (!hasChanges) {
      return { label: "Save", disabled: true }
    }
    return { label: "Save", disabled: false }
  }, [itemName, nameConflict, hasChanges])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!item || buttonState.disabled) return

    const trimmedName = itemName.trim()
    await backend.editItem(item.name, trimmedName, section, quantity, emoji)
    onOpenChange(false)
  }

  const handleDelete = async () => {
    if (!item) return
    await backend.deleteItem(item.name)
    onOpenChange(false)
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item">Item</Label>
            <Autocomplete
              value={itemName}
              onChange={setItemName}
              options={[]} // Don't show suggestions when editing
              placeholder="Enter item name..."
              autoFocus
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

          <div className="space-y-2">
            <Label>Emoji</Label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-md border text-xl hover:bg-accent"
                onClick={() => {
                  // TODO: Open emoji picker
                  setEmoji(emoji ? null : "🛒")
                }}
              >
                {emoji || "😀"}
              </button>
              {emoji && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEmoji(null)}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-2">
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
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
