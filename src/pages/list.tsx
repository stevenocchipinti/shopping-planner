import { useState, useMemo } from "react"
import { useFirebaseContext } from "@/components/providers/firebase-provider"
import { ItemSection } from "@/components/items/item-section"
import { EmptyState } from "@/components/items/empty-state"
import { EditItemDialog } from "@/components/dialogs/edit-item-dialog"
import { slugify } from "@/lib/slugify"
import type { ItemWithMetadata } from "@/types"

export function ListPage() {
  const { items, catalogue, backend, loading } = useFirebaseContext()
  const [editingItem, setEditingItem] = useState<ItemWithMetadata | null>(null)

  // Group items by section with metadata from catalogue
  const { orderedSections, sortedItemsBySection } = useMemo(() => {
    // Create items with metadata
    const itemsWithMetadata: ItemWithMetadata[] = items.map(item => {
      const slug = slugify(item.name)
      const catalogueEntry = catalogue[slug]
      return {
        ...item,
        slug,
        emoji: catalogueEntry?.emoji ?? null,
        section: catalogueEntry?.section ?? "",
      }
    })

    // Group by section
    const itemsBySection = itemsWithMetadata.reduce(
      (acc, item) => {
        const section = item.section
        return {
          ...acc,
          [section]: [...(acc[section] || []), item],
        }
      },
      {} as Record<string, ItemWithMetadata[]>
    )

    // Sort sections: empty section first, then sections with unchecked items (alphabetically),
    // then sections with all items done (alphabetically)
    const notDoneSections = Object.keys(itemsBySection)
      .filter(section => itemsBySection[section].some(item => !item.done))
      .sort((a, b) => {
        // Empty string should come first
        if (a === "" && b !== "") return -1
        if (b === "" && a !== "") return 1
        return a.localeCompare(b)
      })

    const doneSections = Object.keys(itemsBySection)
      .filter(section => itemsBySection[section].every(item => item.done))
      .sort((a, b) => {
        // Empty string should come first
        if (a === "" && b !== "") return -1
        if (b === "" && a !== "") return 1
        return a.localeCompare(b)
      })

    const orderedSections = [...notDoneSections, ...doneSections]

    // Sort items within each section: unchecked first (alphabetically),
    // then checked (alphabetically)
    const sortedItemsBySection = orderedSections.reduce(
      (acc, section) => {
        const sectionItems = itemsBySection[section]
        const notDone = sectionItems
          .filter(i => !i.done)
          .sort((a, b) => a.name.localeCompare(b.name))
        const done = sectionItems
          .filter(i => i.done)
          .sort((a, b) => a.name.localeCompare(b.name))

        return {
          ...acc,
          [section]: [...notDone, ...done],
        }
      },
      {} as Record<string, ItemWithMetadata[]>
    )

    return { orderedSections, sortedItemsBySection }
  }, [items, catalogue])

  const handleToggleItem = async (item: ItemWithMetadata) => {
    await backend.toggleItemDone(item.name, item.done)
  }

  const handleEditItem = (item: ItemWithMetadata) => {
    setEditingItem(item)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-3">
          {orderedSections.map(section => (
            <ItemSection
              key={section}
              section={section}
              items={sortedItemsBySection[section]}
              onToggleItem={handleToggleItem}
              onEditItem={handleEditItem}
            />
          ))}
        </div>
      </div>

      <EditItemDialog
        open={editingItem !== null}
        onOpenChange={open => !open && setEditingItem(null)}
        item={editingItem}
      />
    </>
  )
}
