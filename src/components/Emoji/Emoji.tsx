import React, { CSSProperties } from "react"
import data from "@emoji-mart/data"

import customEmojis from "./customEmojis"
import "./emojiData"

interface EmojiProps {
  emoji: string | null
  size?: number
  style?: CSSProperties
  [key: string]: unknown
}

const isUnicodeEmoji = (value: string | null): boolean =>
  /\p{Extended_Pictographic}/u.test(value || "")

const nativeEmojiById = (id: string | null): string | null => {
  if (!id) return null
  const emojiData = data.emojis as Record<string, { skins?: Array<{ native?: string }> }>
  return emojiData?.[id]?.skins?.[0]?.native || null
}

const Emoji = ({ emoji: userEmoji, size = 24, style, ...props }: EmojiProps) => {
  const emoji = customEmojis.find(customEmoji =>
    customEmoji.short_names.some(name => name === userEmoji)
  )

  if (emoji) {
    return (
      <img
        src={emoji.imageUrl}
        alt={emoji.name}
        width={size}
        height={size}
        style={{ display: "inline-block", ...style }}
        {...props}
      />
    )
  }

  if (isUnicodeEmoji(userEmoji)) {
    return (
      <span
        style={{ display: "inline-block", fontSize: size, lineHeight: 1, ...style }}
        {...props}
      >
        {userEmoji}
      </span>
    )
  }

  const nativeEmoji = nativeEmojiById(userEmoji)

  if (nativeEmoji) {
    return (
      <span
        style={{ display: "inline-block", fontSize: size, lineHeight: 1, ...style }}
        {...props}
      >
        {nativeEmoji}
      </span>
    )
  }

  return null
}

export default Emoji
