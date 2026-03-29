import React, { useEffect, useRef } from "react"
import Picker from "@emoji-mart/react"

import { Button, Popover } from "../ui"
import { useAppTheme } from "../ThemeProvider"
import { emojiPickerFooter, emojiPickerWrap, emojiPopoverContent } from "../dialogs.css"
import { data, customCategories } from "./emojiData"

interface EmojiPickerProps {
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  onSelect: (emoji: string | null) => void
}

interface EmojiSelectEvent {
  native?: string
  id?: string
}

const EmojiPicker = ({ open, anchorEl, onClose, onSelect }: EmojiPickerProps) => {
  const { mode, colors } = useAppTheme()
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    let frameId = 0
    let attempts = 0

    const focusSearch = () => {
      const picker = pickerRef.current?.querySelector("em-emoji-picker") as HTMLElement | null
      if (!picker) return

      picker.tabIndex = -1

      const searchInput = picker.shadowRoot?.querySelector(
        'input[type="search"]'
      ) as HTMLInputElement | null

      if (!searchInput) {
        if (attempts < 5) {
          attempts += 1
          frameId = window.requestAnimationFrame(focusSearch)
        }
        return
      }

      picker.focus()
      searchInput.focus()
    }

    frameId = window.requestAnimationFrame(focusSearch)

    return () => window.cancelAnimationFrame(frameId)
  }, [open])

  return (
    <Popover open={open} anchorEl={anchorEl} onClose={onClose}>
      <div className={emojiPopoverContent}>
        <div className={emojiPickerWrap} ref={pickerRef}>
          <Picker
            data={data}
            color={colors.color.primary}
            theme={mode}
            set="apple"
            custom={customCategories}
            autoFocus
            previewPosition="none"
            skinTonePosition="none"
            onEmojiSelect={(emoji: EmojiSelectEvent) => {
              onSelect(emoji.native || emoji.id || null)
              onClose()
            }}
            perLine={7}
            style={{ margin: "0 auto", border: 0 }}
          />
        </div>
        <div className={emojiPickerFooter}>
          <Button
            onClick={() => {
              onSelect(null)
              onClose()
            }}
          >
            Clear
          </Button>
        </div>
      </div>
    </Popover>
  )
}

export default EmojiPicker
