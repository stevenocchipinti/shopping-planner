import React, { useEffect, useRef } from "react"
import Picker from "@emoji-mart/react"
import { useTheme } from "styled-components"
import { Button, Popover } from "@mui/material"

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
  const { palette } = useTheme()
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
    <Popover
      PaperProps={{
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          backgroundColor: palette.mode === "dark" ? "#222" : "white",
        },
      }}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <div ref={pickerRef}>
        <Picker
          data={data}
          color={palette.primary.main}
          theme={palette.mode}
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
      <Button
        onClick={() => {
          onSelect(null)
          onClose()
        }}
      >
        Clear
      </Button>
    </Popover>
  )
}

export default EmojiPicker
