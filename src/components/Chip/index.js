import React from "react"
import styled from "styled-components"
import { emojiSearch, Emoji } from "../Emoji"

import useLongPress from "./useLongPress"
import useSetting from "../../useSetting"

const Chip = styled.span`
  display: flex;
  align-items: center;
  background: ${({ done, theme }) =>
    done ? theme.app.chipDone : theme.app.chip};
  font-size: 15px;
  line-height: 24px;
  border-radius: 999px;
  box-shadow: ${({ theme, outline }) =>
    outline ? `inset 0 0 0px 1px ${theme.palette.grey[500]}` : "none"};
  padding: 8px 14px;
  min-height: 44px;
  border: 1px solid ${({ theme, done }) =>
    done ? theme.app.border : theme.palette.action.selected};
  color: ${({ done, theme }) =>
    done ? theme.palette.text.secondary : theme.palette.text.primary};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.2s ease, background-color 0.3s ease-in-out;

  :active {
    transform: scale(0.98);
  }

  img,
  em-emoji {
    height: 16px;
    width: 16px;
    margin: 4px 4px 4px 0;
    filter: ${({ done }) => (done ? "grayscale(1) opacity(0.4)" : "none")};
  }
`

const Value = styled.span`
  font-weight: 500;
  text-decoration-line: ${({ done }) => (done ? "line-through" : "inherit")};
`

const Qty = styled.span`
  display: inline-flex;
  align-items: center;
  line-height: 16px;
  background-color: ${({ theme }) => theme.palette.action.selected};
  border-radius: 999px;
  padding: 5px 8px;
  margin-left: 8px;
`

const Svg = styled.svg`
  stroke: ${({ theme }) => theme.palette.text.secondary};
  margin-right: 3px;
`

const X = () => (
  <Svg height={6} width={6}>
    <path d="M0 0 L 6 6" />
    <path d="M6 0 L 0 6" />
  </Svg>
)

export default ({ done, qty, children, emoji, onLongPress, ...props }) => {
  const longPress = useLongPress(onLongPress)
  const [emojiSupport] = useSetting("emojiSupport")
  const assumedEmoji =
    emoji === undefined ? emojiSearch(children)?.[0]?.id : emoji
  return (
    <Chip done={done} {...longPress} {...props}>
      {emojiSupport && assumedEmoji && <Emoji emoji={assumedEmoji} size={16} />}
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
