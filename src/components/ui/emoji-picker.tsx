import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import Picker from "@emoji-mart/react"
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
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const { effectiveTheme } = useTheme()

  // Update picker position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const pickerHeight = 435 // approximate height of emoji picker

      // Position below button, but flip up if not enough space
      let top = rect.bottom + 8
      if (top + pickerHeight > viewportHeight - 20) {
        top = Math.max(20, rect.top - pickerHeight - 8)
      }

      // Keep left aligned with button, but ensure it doesn't overflow viewport
      let left = rect.left
      const pickerWidth = 352 // approximate width of emoji picker
      if (left + pickerWidth > window.innerWidth - 20) {
        left = window.innerWidth - pickerWidth - 20
      }

      // This effect calculates the optimal position for the emoji picker based on viewport dimensions.
      // Setting state here is necessary because positioning depends on layout measurements that are
      // only available after the DOM is rendered. This is a legitimate layout effect pattern.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPickerPosition({ top, left: Math.max(20, left) })
    }
    // This effect calculates layout-dependent positioning
  }, [isOpen])

  // Close picker when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const isClickInsidePicker = (event: MouseEvent | PointerEvent) => {
      // Check if click is on the button
      if (
        buttonRef.current &&
        buttonRef.current.contains(event.target as Node)
      ) {
        return true
      }

      // Check if click is inside the picker container using bounding rect
      // This handles Shadow DOM elements that don't report containment properly
      if (pickerRef.current) {
        const rect = pickerRef.current.getBoundingClientRect()
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          return true
        }
      }

      return false
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!isClickInsidePicker(event)) {
        setIsOpen(false)
      }
    }

    // Use a slight delay to avoid the click that opened the picker from closing it
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleEmojiSelect = (emoji: { id: string; native: string }) => {
    // CRITICAL: For backward compatibility with old app, store emoji IDs (shortcodes)
    // for both standard and custom emojis
    // Old app: stores "green_apple" for standard, "custom-broccoli" for custom
    onChange(emoji.id)
    setIsOpen(false)
  }

  const pickerElement = isOpen
    ? createPortal(
        <div
          ref={pickerRef}
          className="fixed z-[200] rounded-lg border bg-popover shadow-lg pointer-events-auto"
          style={{
            top: pickerPosition.top,
            left: pickerPosition.left,
          }}
          // Stop ALL events from propagating to prevent drawer/overlay from closing
          // This is critical because emoji-mart uses Shadow DOM and clicks inside it
          // are seen as "outside" clicks by parent components
          onMouseDown={e => e.stopPropagation()}
          onPointerDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onTouchMove={e => e.stopPropagation()}
          onTouchEnd={e => e.stopPropagation()}
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
            dynamicWidth={false}
          />
        </div>,
        document.body
      )
    : null

  if (variant === "inline") {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-accent transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          title="Pick emoji"
        >
          {value ? (
            <Emoji id={value} size={18} />
          ) : (
            <Smile className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {pickerElement}
      </div>
    )
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

      {pickerElement}

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
