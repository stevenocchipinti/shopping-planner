import { useRef, useState } from "react"
import { Trash2 } from "lucide-react"
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
import type { ItemWithMetadata } from "@/types"

interface EditItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ItemWithMetadata | null
}

export function EditItemDialog({
  open,
  onOpenChange,
  item,
}: EditItemDialogProps) {
  const { backend } = useFirebaseContext()
  const formRef = useRef<ItemFormHandle>(null)
  const [buttonState, setButtonState] = useState({
    label: "Save",
    disabled: true,
  })

  // Callback for when form state changes
  const handleFormStateChange = () => {
    if (formRef.current) {
      setButtonState(formRef.current.getButtonState())
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!item || !formRef.current) return

    const currentButtonState = formRef.current.getButtonState()
    if (currentButtonState.disabled) return

    const data = formRef.current.getData()
    await backend.editItem(
      item.name,
      data.name,
      data.section,
      data.quantity,
      data.emoji
    )
    onOpenChange(false)
  }

  const handleDelete = async () => {
    if (!item) return
    await backend.deleteItem(item.name)
    onOpenChange(false)
  }

  if (!item) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-md mx-auto">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Edit Item</DrawerTitle>
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
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <ItemForm
            key={item.name}
            ref={formRef}
            initialItem={item}
            mode="edit"
            onStateChange={handleFormStateChange}
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
