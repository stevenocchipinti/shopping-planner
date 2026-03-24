import React from "react"

import customEmojis from "./customEmojis"
import "./emojiData"

export default ({ emoji: userEmoji, size = 24, style, ...props }) => {
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

  return <em-emoji id={userEmoji} set="apple" size={`${size}px`} style={style} {...props} />
}
