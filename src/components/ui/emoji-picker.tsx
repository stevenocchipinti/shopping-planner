import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { Smile } from "lucide-react"
import { customEmojis } from "@/lib/emoji/custom-emojis"
import { Emoji } from "./emoji"
import { Button } from "./button"
import { useTheme } from "@/contexts/theme-context"

interface EmojiPickerProps {
  value: string | null
  onChange: (emojiId: string) => void
  variant?: "default" | "inline"
}

export function EmojiPicker({
  value,
  onChange,
  variant = "default",
}: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { effectiveTheme } = useTheme()

  const handleEmojiSelect = useCallback((emoji: any) => {
    console.log('[EmojiPicker] handleEmojiSelect called with:', emoji)
    // CRITICAL: For backward compatibility with old app, store emoji IDs (shortcodes)
    // for both standard and custom emojis
    // Old app: stores "green_apple" for standard, "custom-broccoli" for custom
    if (emoji && emoji.id) {
      console.log('[EmojiPicker] Calling onChange with:', emoji.id)
      onChange(emoji.id)
      setIsOpen(false)
    } else {
      console.error('[EmojiPicker] Invalid emoji object:', emoji)
    }
  }, [onChange])

  const handleClear = () => {
    onChange("")
    setIsOpen(false)
  }

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  // Render the picker overlay using a portal to escape parent positioning constraints
  const pickerOverlay = isOpen
    ? createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[200] bg-black/80 animate-in fade-in-0"
            onClick={() => setIsOpen(false)}
          />
          {/* Content - positioned at bottom of screen */}
          <div className="fixed inset-x-0 bottom-0 z-[200] flex flex-col rounded-t-[10px] border bg-background animate-in slide-in-from-bottom-2 max-h-[80vh] pointer-events-auto">
            <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted flex-shrink-0" />
            <div className="flex flex-col items-center p-4 overflow-auto">
              <h2 className="sr-only">Pick an emoji</h2>
              {/* Use @emoji-mart/react Picker component */}
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme={effectiveTheme}
                previewPosition="none"
                skinTonePosition="search"
                custom={customEmojis}
                perLine={8}
                maxFrequentRows={2}
                autoFocus
              />
              <div className="flex gap-2 mt-4 w-full max-w-[352px] flex-shrink-0">
                {value && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )
    : null

  if (variant === "inline") {
    return (
      <>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-accent transition-colors"
          onClick={() => setIsOpen(true)}
          title="Pick emoji"
        >
          {value ? (
            <Emoji id={value} size={18} />
          ) : (
            <Smile className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {pickerOverlay}
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-md border text-xl hover:bg-accent"
        onClick={() => setIsOpen(true)}
      >
        {value ? <Emoji id={value} size={24} fallback="😀" /> : "😀"}
      </button>
      {pickerOverlay}
    </>
  )
}
