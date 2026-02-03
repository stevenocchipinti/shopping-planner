import { useState, useEffect, useCallback } from "react"
import EmojiPickerReact from "emoji-picker-react"
import type { EmojiClickData } from "emoji-picker-react"
import { SkinTones } from "emoji-picker-react"
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

/**
 * Emoji ID format strategy:
 * - Custom emojis: "custom-broccoli" (matches stored format)
 * - Standard emojis: use the emoji character itself (Unicode) as the ID
 *
 * This ensures backward compatibility while being simple and testable.
 * When displaying, we check if it starts with "custom-" to determine
 * whether to use an image or render the Unicode directly.
 */

export function EmojiPicker({
  value,
  onChange,
  variant = "default",
}: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { effectiveTheme } = useTheme()

  const handleEmojiSelect = useCallback(
    (emojiData: EmojiClickData) => {
      // For custom emojis, emoji-picker-react returns the id in the unified field
      // For standard emojis, we store the emoji character itself (Unicode)
      const emojiId = emojiData.isCustom
        ? emojiData.unified
        : emojiData.emoji

      if (emojiId) {
        onChange(emojiId)
        setIsOpen(false)
      }
    },
    [onChange]
  )

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

  // Render the picker overlay - positioned at bottom with modal styling
  const pickerOverlay = isOpen ? (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/80 animate-in fade-in-0"
        onClick={() => setIsOpen(false)}
      />
      {/* Picker content - bottom sheet style */}
      <div className="fixed inset-x-0 bottom-0 z-[201] flex flex-col rounded-t-[10px] border bg-background animate-in slide-in-from-bottom-2 max-h-[80vh] pointer-events-auto">
        {/* Drag handle */}
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted flex-shrink-0" />

        {/* Picker */}
        <div className="flex flex-col items-center p-4 overflow-auto">
          <h2 className="sr-only">Pick an emoji</h2>
          <EmojiPickerReact
            onEmojiClick={handleEmojiSelect}
            theme={effectiveTheme as any}
            previewConfig={{ showPreview: false }}
            defaultSkinTone={SkinTones.NEUTRAL}
            customEmojis={customEmojis}
            height={400}
            width="100%"
            lazyLoadEmojis={true}
            searchPlaceholder="Search emoji..."
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 px-4 pb-4 w-full flex-shrink-0">
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
    </>
  ) : null

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
