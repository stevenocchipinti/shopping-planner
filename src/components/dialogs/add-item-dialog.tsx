import { useRef } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ItemForm, type ItemFormHandle } from "@/components/form/item-form"
import { useFirebaseContext } from "@/components/providers/firebase-provider"
import { slugify } from "@/lib/slugify"

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddItemDialog({ open, onOpenChange }: AddItemDialogProps) {
  const { items, backend } = useFirebaseContext()
  const formRef = useRef<ItemFormHandle>(null)
  const formKey = useRef(0)

  // Force form to remount when dialog opens to reset state
  if (open && formRef.current === null) {
    formKey.current += 1
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formRef.current) return

    const buttonState = formRef.current.getButtonState()
    if (buttonState.disabled) return

    const data = formRef.current.getData()
    const slug = slugify(data.name)
    const existingItem = items.find((item) => slugify(item.name) === slug)

    switch (buttonState.action) {
      case "add":
      case "move":
      case "update":
        await backend.addItem(data.name, data.section, data.quantity, data.emoji)
        break
      case "uncheck":
        if (existingItem) {
          await backend.toggleItemDone(existingItem.name, existingItem.done)
        }
        break
    }

    onOpenChange(false)
  }

  const buttonState = formRef.current?.getButtonState() || { label: "Add", disabled: true }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle>Add Item</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <ItemForm key={formKey.current} ref={formRef} mode="add" />

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
