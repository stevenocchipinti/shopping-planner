import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FolderOpen, Plus, Trash2, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { generateListId } from "@/lib/firestore"
import { cn } from "@/lib/utils"

interface OpenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MAX_MRU_ITEMS = 10

export function OpenDialog({ open, onOpenChange }: OpenDialogProps) {
  const navigate = useNavigate()
  const { listId: currentListId } = useParams<{ listId: string }>()
  const [listMru, setListMru] = useLocalStorage<string[]>("listMRU", [])
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")

  // Add current list to MRU when dialog opens
  useEffect(() => {
    if (open && currentListId) {
      addToMru(currentListId)
    }
  }, [open, currentListId])

  const addToMru = (listId: string) => {
    // Remove if already exists, then add to front
    const filtered = listMru.filter((id: string) => id !== listId)
    setListMru([listId, ...filtered].slice(0, MAX_MRU_ITEMS))
  }

  const removeFromMru = (listId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setListMru(listMru.filter((id: string) => id !== listId))
  }

  const extractListId = (input: string): string | null => {
    const trimmed = input.trim()
    
    // If it looks like a URL, try to extract the list ID
    if (trimmed.includes("/list/")) {
      const match = trimmed.match(/\/list\/([^/\s]+)/)
      return match ? match[1] : null
    }
    
    // Otherwise, assume it's a raw list ID (alphanumeric)
    if (/^[a-zA-Z0-9]+$/.test(trimmed)) {
      return trimmed
    }
    
    return null
  }

  const handleOpenList = () => {
    const listId = extractListId(inputValue)
    
    if (!listId) {
      setError("Please enter a valid list ID or URL")
      return
    }

    addToMru(listId)
    onOpenChange(false)
    navigate(`/list/${listId}`)
  }

  const handleSelectMru = (listId: string) => {
    addToMru(listId)
    onOpenChange(false)
    navigate(`/list/${listId}`)
  }

  const handleCreateNew = () => {
    const newListId = generateListId()
    addToMru(newListId)
    onOpenChange(false)
    navigate(`/list/${newListId}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleOpenList()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Open List
          </DialogTitle>
          <DialogDescription>
            Open an existing list by URL or ID, or create a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Input for URL or ID */}
          <div className="space-y-2">
            <Label htmlFor="list-input">List URL or ID</Label>
            <div className="flex gap-2">
              <Input
                id="list-input"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setError("")
                }}
                onKeyDown={handleKeyDown}
                placeholder="Paste URL or enter list ID..."
                className={cn(error && "border-destructive")}
              />
              <Button onClick={handleOpenList} disabled={!inputValue.trim()}>
                Open
              </Button>
            </div>
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          {/* Recently used lists */}
          {listMru.length > 0 && (
            <div className="space-y-2">
              <Label>Recent Lists</Label>
              <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
                {listMru.map((listId) => (
                  <button
                    key={listId}
                    onClick={() => handleSelectMru(listId)}
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors",
                      "hover:bg-accent",
                      listId === currentListId && "bg-accent/50"
                    )}
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 truncate font-mono text-xs">
                      {listId}
                    </span>
                    {listId === currentListId && (
                      <span className="text-xs text-muted-foreground">(current)</span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={(e) => removeFromMru(listId, e)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleCreateNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
