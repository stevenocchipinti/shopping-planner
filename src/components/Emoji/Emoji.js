import React from "react"
import data from "@emoji-mart/data"

import customEmojis from "./customEmojis"
import "./emojiData"

const isUnicodeEmoji = value => /\p{Extended_Pictographic}/u.test(value || "")

const nativeEmojiById = id => data.emojis?.[id]?.skins?.[0]?.native || null

const Emoji = ({ emoji: userEmoji, size = 24, style, ...props }) => {
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
      <span style={{ display: "inline-block", fontSize: size, lineHeight: 1, ...style }} {...props}>
        {userEmoji}
      </span>
    )
  }

  const nativeEmoji = nativeEmojiById(userEmoji)

  if (nativeEmoji) {
    return (
      <span style={{ display: "inline-block", fontSize: size, lineHeight: 1, ...style }} {...props}>
        {nativeEmoji}
      </span>
    )
  }

  return null
}

export default Emoji
