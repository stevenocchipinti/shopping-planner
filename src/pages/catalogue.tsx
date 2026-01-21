import { useState } from "react"
import { Trash2, Search } from "lucide-react"
import { useFirebaseContext } from "@/components/providers/firebase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Emoji } from "@/components/ui/emoji"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"

export function CataloguePage() {
  const { catalogue, backend, loading } = useFirebaseContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<{
    slug: string
    name: string
  } | null>(null)

  // Convert catalogue to array and sort alphabetically
  const catalogueItems = Object.entries(catalogue)
    .map(([slug, entry]) => ({
      slug,
      name: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      section: entry.section || "",
      displaySection: entry.section
        ? entry.section
            .replace(/-/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase())
        : "",
      emoji: entry.emoji,
    }))
    .filter(
      item =>
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.section.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleDelete = async () => {
    if (!deleteConfirm) return
    await backend.deleteCatalogueItem(deleteConfirm.name)
    setDeleteConfirm(null)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading catalogue...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">History</h1>
        <span className="text-sm text-muted-foreground">
          {catalogueItems.length} items
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {catalogueItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery
              ? "No items match your search"
              : "No items in catalogue yet"}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left py-3 px-4 font-medium">Item</th>
                <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">
                  Section
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {catalogueItems.map(item => (
                <tr
                  key={item.slug}
                  className="border-b last:border-b-0 hover:bg-muted/30"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {item.emoji && <Emoji id={item.emoji} size={18} />}
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="sm:hidden text-xs text-muted-foreground block">
                          {item.displaySection || (
                            <span className="italic opacity-50">
                              No section
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                    {item.displaySection || (
                      <span className="italic opacity-50">None</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        setDeleteConfirm({ slug: item.slug, name: item.name })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {item.name}</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Drawer */}
      <Drawer
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Delete from History</DrawerTitle>
            <DrawerDescription>
              Are you sure you want to remove "{deleteConfirm?.name}" from your
              history? This won't remove it from your current shopping list.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex-1"
            >
              Delete
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
