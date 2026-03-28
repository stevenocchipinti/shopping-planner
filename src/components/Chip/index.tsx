import React, { FC, HTMLAttributes } from "react"
import styled from "styled-components"
import { emojiSearch, Emoji } from "../Emoji"

import useLongPress from "./useLongPress"
import useSetting from "../../useSetting"

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  done?: boolean
  qty?: number
  children: React.ReactNode
  emoji?: string | null
  onLongPress?: () => void
  onClick?: () => void
}

const ChipStyled = styled.span<{ done?: boolean; hasQty?: boolean }>`
  display: inline-flex;
  align-items: center;
  background: ${({ done, theme }) =>
    done ? theme.app.chipDone : theme.app.chip};
  font-size: 14px;
  line-height: 20px;
  border-radius: 999px;
  box-shadow: none;
  padding: 7px 10px;
  min-height: 38px;
  border: 1px solid
    ${({ theme, done }) => (done ? "transparent" : theme.palette.divider)};
  color: ${({ done, theme }) =>
    done ? theme.palette.text.secondary : theme.palette.text.primary};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  :active {
    transform: scale(0.97);
  }
`

const EmojiSlot = styled.span<{ done?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 7px;
  flex-shrink: 0;
  opacity: ${({ done }) => (done ? 0.45 : 1)};
  filter: ${({ done }) => (done ? "grayscale(1)" : "none")};

  > img,
  > span,
  > em-emoji {
    display: block;
  }
`

const Value = styled.span<{ done?: boolean }>`
  font-weight: 500;
  text-decoration-line: ${({ done }) => (done ? "line-through" : "inherit")};
  opacity: ${({ done }) => (done ? 0.45 : 1)};
`

const Qty = styled.span`
  display: inline-flex;
  align-items: center;
  line-height: 14px;
  background-color: ${({ theme }) => theme.palette.divider};
  border-radius: 999px;
  padding: 3px 7px;
  margin-left: 6px;
  font-size: 12px;
  font-weight: 600;
`

const Svg = styled.svg`
  stroke: ${({ theme }) => theme.palette.text.secondary};
  margin-right: 2px;
`

const X: FC = () => (
  <Svg height={5} width={5}>
    <path d="M0 0 L 5 5" />
    <path d="M5 0 L 0 5" />
  </Svg>
)

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
    <ChipStyled done={done} hasQty={hasQty} {...longPress} {...props}>
      {emojiSupport && assumedEmoji && (
        <EmojiSlot done={done}>
          <Emoji emoji={assumedEmoji} size={15} />
        </EmojiSlot>
      )}
      <Value done={done}>{children}</Value>
      {hasQty && (
        <Qty>
          <X />
          {qty}
        </Qty>
      )}
    </ChipStyled>
  )
}

export default Chip
