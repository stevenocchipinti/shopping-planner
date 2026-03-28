import { useEffect, useState } from "react"

interface LongPressHandlers {
  onMouseDown: () => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onTouchStart: () => void
  onTouchEnd: () => void
}

const useLongPress = (
  callback: () => void = () => {},
  ms: number = 300
): LongPressHandlers => {
  const [startLongPress, setStartLongPress] = useState(false)

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | undefined

    if (startLongPress) {
      timerId = setTimeout(() => {
        setStartLongPress(false)
        callback()
      }, ms)
    } else {
      clearTimeout(timerId)
    }

    return () => clearTimeout(timerId)
  }, [callback, ms, startLongPress])

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
  }
}

export default useLongPress
