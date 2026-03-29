import React, { FC, useEffect, useRef, useState } from "react"
import { RefreshCw, WifiOff } from "lucide-react"

import { useAppState } from "./Backend"
import {
  statusInline,
  statusInlineButton,
  statusInlineIcon,
  statusTooltip,
  statusTooltipRecipe,
} from "./app-shell.css"

interface OfflineNoticeProps {
  variant?: "default" | "recipe"
}

const OfflineNotice: FC<OfflineNoticeProps> = ({ variant = "default" }) => {
  const { isOnline, showingCachedData, hasPendingWrites, recentlyReconnected } = useAppState()
  const [open, setOpen] = useState(false)
  const timerRef = useRef<number | null>(null)

  const showReconnectNotice = isOnline && recentlyReconnected && hasPendingWrites
  const showOfflineNotice = !isOnline

  if (!showReconnectNotice && !showOfflineNotice) return null

  const copy = showReconnectNotice
    ? "Recent changes are saved on this device and are still syncing to the shared list."
    : hasPendingWrites
      ? "You are offline. Changes are saved on this device and will sync to the shared list when you reconnect."
      : showingCachedData
        ? "You are viewing the last saved version available on this device. You can keep editing and your changes will sync when you reconnect."
        : "You are offline. Saved list data will appear here after this device has synced once online."

  useEffect(() => {
    if (!showReconnectNotice) return

    setOpen(true)
    timerRef.current = window.setTimeout(() => setOpen(false), 2400)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [showReconnectNotice])

  return (
    <div className={statusInline}>
      <button
        className={statusInlineButton}
        type="button"
        aria-label={showReconnectNotice ? "Syncing changes" : "Offline mode"}
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        <span className={statusInlineIcon}>
          {showReconnectNotice ? <RefreshCw size={14} /> : <WifiOff size={14} />}
        </span>
      </button>
      {open ? (
        <div className={`${statusTooltip} ${variant === "recipe" ? statusTooltipRecipe : ""}`}>
          {copy}
        </div>
      ) : null}
    </div>
  )
}

export default OfflineNotice
