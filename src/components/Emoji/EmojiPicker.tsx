import React from "react"
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
