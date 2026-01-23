import { useRef, useState, useEffect } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ItemForm, type ItemFormHandle } from "@/components/form/item-form"
import { useFirebaseContext } from "@/contexts/firebase-context"
import { slugify } from "@/lib/slugify"

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddItemDialog({ open, onOpenChange }: AddItemDialogProps) {
  const { items, backend } = useFirebaseContext()
  const formRef = useRef<ItemFormHandle>(null)
  const [formKey, setFormKey] = useState(0)
  const [buttonState, setButtonState] = useState({
    label: "Add",
    disabled: false,
  })

  // Reset form when dialog opens
   
  useEffect(() => {
    if (open) {
      setFormKey(prev => prev + 1)
    }
  }, [open])

  // Update button state from form
  // This effect intentionally runs on every render to keep button state in sync with form validation.
  // We need exhaustive-deps disabled because adding dependencies would cause the effect to only run
  // when those specific values change, but we need it to run on every render to catch all form changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (formRef.current) {
      const newState = formRef.current.getButtonState()
      setButtonState(newState)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formRef.current) return

    const currentButtonState = formRef.current.getButtonState()
    if (currentButtonState.disabled) return

    const data = formRef.current.getData()
    const slug = slugify(data.name)
    const existingItem = items.find(item => slugify(item.name) === slug)

    switch (currentButtonState.action) {
      case "add":
      case "move":
      case "update":
        await backend.addItem(
          data.name,
          data.section,
          data.quantity,
          data.emoji
        )
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle>Add Item</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <ItemForm key={formKey} ref={formRef} mode="add" />

          <DrawerFooter className="flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={buttonState.disabled}
              className="flex-1"
            >
              {buttonState.label}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
