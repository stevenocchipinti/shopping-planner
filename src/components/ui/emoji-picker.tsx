import { useState, useRef, useEffect } from "react"
import Picker from "@emoji-mart/react"
import { customEmojis } from "@/lib/emoji/custom-emojis"
import { Emoji } from "./emoji"
import { Button } from "./button"
import { useTheme } from "@/components/providers/theme-provider"

interface EmojiPickerProps {
  value: string | null
  onChange: (emojiId: string) => void
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const { effectiveTheme } = useTheme()

  // Close picker when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleEmojiSelect = (emoji: { id: string; native: string }) => {
    // For standard emojis, store the native emoji character
    // For custom emojis, store the custom emoji ID
    const emojiValue = emoji.id.startsWith("custom-") ? emoji.id : emoji.native
    onChange(emojiValue)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-md border text-xl hover:bg-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? <Emoji id={value} size={24} fallback="😀" /> : "😀"}
      </button>

      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute left-0 top-12 z-50 rounded-lg border bg-popover shadow-lg"
        >
          <Picker
            data={async () => {
              const response = await fetch(
                "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
              )
              return response.json()
            }}
            onEmojiSelect={handleEmojiSelect}
            theme={effectiveTheme}
            previewPosition="none"
            skinTonePosition="search"
            custom={customEmojis}
            perLine={8}
            maxFrequentRows={2}
          />
        </div>
      )}

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          className="mt-2"
        >
          Clear
        </Button>
      )}
    </div>
  )
}
