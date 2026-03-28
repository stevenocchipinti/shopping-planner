import React from "react"
import styled from "styled-components"
import { emojiSearch, Emoji } from "../Emoji"

import useLongPress from "./useLongPress"
import useSetting from "../../useSetting"

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  background: ${({ done, theme }) =>
    done ? theme.app.chipDone : theme.app.chip};
  font-size: 14px;
  line-height: 20px;
  border-radius: 999px;
  box-shadow: none;
  padding: 7px 14px;
  min-height: 38px;
  border: 1px solid ${({ theme, done }) =>
    done ? "transparent" : theme.palette.divider};
  color: ${({ done, theme }) =>
    done ? theme.palette.text.secondary : theme.palette.text.primary};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s ease, opacity 0.15s ease;

  :active {
    transform: scale(0.97);
  }

  img,
  em-emoji {
    height: 15px;
    width: 15px;
    margin: 2px 5px 2px 0;
    filter: ${({ done }) => (done ? "grayscale(1) opacity(0.35)" : "none")};
  }
`

const Value = styled.span`
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

const X = () => (
  <Svg height={5} width={5}>
    <path d="M0 0 L 5 5" />
    <path d="M5 0 L 0 5" />
  </Svg>
)

export default ({ done, qty, children, emoji, onLongPress, ...props }) => {
  const longPress = useLongPress(onLongPress)
  const [emojiSupport] = useSetting("emojiSupport")
  const assumedEmoji =
    emoji === undefined ? emojiSearch(children)?.[0]?.id : emoji
  return (
    <Chip done={done} {...longPress} {...props}>
      {emojiSupport && assumedEmoji && <Emoji emoji={assumedEmoji} size={15} />}
      <Value done={done}>{children}</Value>
      {qty && qty > 1 && (
        <Qty>
          <X />
          {qty}
        </Qty>
      )}
    </Chip>
  )
}
