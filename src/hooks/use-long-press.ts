import { useCallback, useRef } from "react"

interface UseLongPressOptions {
  onLongPress: () => void
  onClick?: () => void
  delay?: number
}

export function useLongPress({
  onLongPress,
  onClick,
  delay = 300,
}: UseLongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)

  const start = useCallback(() => {
    isLongPress.current = false
    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      onLongPress()
    }, delay)
  }, [onLongPress, delay])

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!isLongPress.current && onClick) {
      onClick()
    }
  }, [onClick])

  const handleMouseDown = useCallback(() => {
    start()
  }, [start])

  const handleMouseUp = useCallback(() => {
    clear()
    handleClick()
  }, [clear, handleClick])

  const handleMouseLeave = useCallback(() => {
    clear()
  }, [clear])

  const handleTouchStart = useCallback(() => {
    start()
  }, [start])

  const handleTouchEnd = useCallback(() => {
    clear()
    handleClick()
  }, [clear, handleClick])

  return {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  }
}
