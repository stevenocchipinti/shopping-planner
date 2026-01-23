import { useState, useEffect } from "react"
import {
  isCustomEmoji,
  getCustomEmojiUrl,
  shortcodeToNative,
} from "@/lib/emoji/emoji-search"

interface EmojiProps {
  id: string | null
  size?: number | string
  fallback?: string
  className?: string
}

// Cache for emoji ID to native character mapping
const emojiCache = new Map<string, string>()

// Check if a string is a native emoji (contains emoji characters)
function isNativeEmoji(str: string): boolean {
  // Check if the string contains emoji characters using a regex
  // This matches most emoji including those with skin tones and ZWJ sequences
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/u
  return emojiRegex.test(str)
}

// Check if a string looks like an emoji shortcode (e.g., "apple", "red_apple")
function isShortcodeId(str: string): boolean {
  // Shortcodes are typically lowercase ASCII with underscores, no special characters
  return /^[a-z0-9_+-]+$/.test(str) && !str.startsWith("custom-")
}

/**
 * Unified emoji renderer that handles both custom and standard emojis
 * Also handles legacy emoji-mart shortcode IDs for backward compatibility
 */
export function Emoji({ id, size = 24, fallback, className = "" }: EmojiProps) {
  const [resolvedEmoji, setResolvedEmoji] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!id) {
      // When there's no emoji ID, we need to clear the resolved emoji state immediately.
      // This is a legitimate state reset in response to prop changes, not a cascading render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResolvedEmoji(null)
      return
    }

    // If it's a custom emoji or native emoji, no need to resolve
    if (isCustomEmoji(id) || isNativeEmoji(id)) {
      setResolvedEmoji(id)
      return
    }

    // Check cache first
    if (emojiCache.has(id)) {
      setResolvedEmoji(emojiCache.get(id)!)
      return
    }

    // If it looks like a shortcode, try to resolve it
    if (isShortcodeId(id)) {
      setIsLoading(true)
      // This is an async operation to fetch emoji data from the emoji-mart library.
      // setState in the promise callback is the correct pattern for handling async data.
      shortcodeToNative(id)
        .then(native => {
          if (native) {
            emojiCache.set(id, native)
            setResolvedEmoji(native)
          } else {
            // Not found, use the id as-is (will show as text)
            setResolvedEmoji(id)
          }
          setIsLoading(false)
        })
        .catch(() => {
          // Failed to resolve, use as-is
          setResolvedEmoji(id)
          setIsLoading(false)
        })
    } else {
      // Not a recognized format, use as-is
      setResolvedEmoji(id)
    }
    // This effect performs async emoji resolution
     
  }, [id])

  if (!id) {
    return fallback ? <span className={className}>{fallback}</span> : null
  }

  // Show nothing while loading (or could show a placeholder)
  if (isLoading || resolvedEmoji === null) {
    return (
      <span
        className={`inline-block ${className}`}
        style={{
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
        }}
      />
    )
  }

  const displayId = resolvedEmoji

  // Handle custom emojis (PNG images)
  if (isCustomEmoji(displayId)) {
    const url = getCustomEmojiUrl(displayId)
    if (url) {
      return (
        <img
          src={url}
          alt=""
          className={`inline-block ${className}`}
          style={{
            width: typeof size === "number" ? `${size}px` : size,
            height: typeof size === "number" ? `${size}px` : size,
          }}
        />
      )
    }
    // Custom emoji ID not found in lookup - this shouldn't happen but handle gracefully
    // Try to construct the URL directly from the ID
    const fallbackUrl = `/emoji/${displayId.replace("custom-", "")}.png`
    return (
      <img
        src={fallbackUrl}
        alt=""
        className={`inline-block ${className}`}
        style={{
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
        }}
        onError={e => {
          // If image fails to load, hide it
          ;(e.target as HTMLImageElement).style.display = "none"
        }}
      />
    )
  }

  // Handle standard emojis - the id is the unicode character itself
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        fontSize: typeof size === "number" ? `${size}px` : size,
      }}
    >
      {displayId}
    </span>
  )
}
