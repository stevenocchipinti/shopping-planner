import { isCustomEmoji, getCustomEmojiUrl } from "@/lib/emoji/emoji-search"

interface EmojiProps {
  id: string | null
  size?: number | string
  fallback?: string
  className?: string
}

/**
 * Unified emoji renderer that handles both custom and standard emojis
 */
export function Emoji({ id, size = 24, fallback, className = "" }: EmojiProps) {
  if (!id) {
    return fallback ? <span className={className}>{fallback}</span> : null
  }

  // Handle custom emojis (PNG images)
  if (isCustomEmoji(id)) {
    const url = getCustomEmojiUrl(id)
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
    const fallbackUrl = `/emoji/${id.replace("custom-", "")}.png`
    return (
      <img
        src={fallbackUrl}
        alt=""
        className={`inline-block ${className}`}
        style={{
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
        }}
        onError={(e) => {
          // If image fails to load, hide it
          (e.target as HTMLImageElement).style.display = "none"
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
      {id}
    </span>
  )
}
