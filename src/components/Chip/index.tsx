import React, { FC, HTMLAttributes } from "react"

import useSetting from "../../useSetting"
import { emojiSearch, Emoji } from "../Emoji"
import {
  chip,
  chipDone,
  chipEmoji,
  chipEmojiDone,
  chipQty,
  chipQtyX,
  chipValue,
  chipValueDone,
} from "../listing.css"
import { cx } from "../ui"
import useLongPress from "./useLongPress"

interface ChipProps extends HTMLAttributes<HTMLButtonElement> {
  done?: boolean
  qty?: number
  children: React.ReactNode
  emoji?: string | null
  onLongPress?: () => void
  onClick?: () => void
}

const Chip: FC<ChipProps> = ({
  done,
  qty,
  children,
  emoji,
  onLongPress,
  ...props
}) => {
  const longPress = useLongPress(onLongPress)
  const [emojiSupport] = useSetting("emojiSupport")
  const assumedEmoji =
    emoji === undefined ? emojiSearch(String(children))?.[0]?.id : emoji
  const hasQty = Boolean(qty && qty > 1)

  return (
    <button
      className={cx(chip, done && chipDone)}
      type="button"
      {...longPress}
      {...props}
    >
      {emojiSupport && assumedEmoji ? (
        <span className={cx(chipEmoji, done && chipEmojiDone)}>
          <Emoji emoji={assumedEmoji} size={15} />
        </span>
      ) : null}
      <span className={cx(chipValue, done && chipValueDone)}>{children}</span>
      {hasQty ? (
        <span className={chipQty}>
          <span className={chipQtyX}>x</span>
          {qty}
        </span>
      ) : null}
    </button>
  )
}

export default Chip
