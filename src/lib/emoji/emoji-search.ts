import { customEmojis } from "./custom-emojis"

/**
 * Search for custom emojis by keyword
 * Returns first matching custom emoji or null
 */
function searchCustomEmojis(searchTerm: string): string | null {
  if (!searchTerm) return null

  // Strip plural endings and special characters (same as original app)
  const normalized = searchTerm
    .replace(/[()+*{}[\]]*/gi, "")
    .replace(/i?e?s?$/, "")
    .toLowerCase()
    .trim()

  // Search through all custom emoji categories
  for (const category of customEmojis) {
    for (const emoji of category.emojis) {
      // Check if any keyword matches
      for (const keyword of emoji.keywords) {
        if (keyword.toLowerCase().includes(normalized)) {
          return emoji.id
        }
      }
    }
  }

  return null
}

/**
 * Search for emojis with custom emojis prioritized
 * Returns emoji ID (either custom-* or null for now - standard emoji search TBD)
 */
export async function searchEmoji(
  searchTerm: string
): Promise<string | null> {
  if (!searchTerm.trim()) return null

  // Try custom emojis first (priority)
  const customResult = searchCustomEmojis(searchTerm)
  if (customResult) {
    return customResult
  }

  // For now, we'll let the picker handle standard emojis
  // User can manually select from the picker
  return null
}

/**
 * Check if an emoji ID is a custom emoji
 */
export function isCustomEmoji(emojiId: string | null): boolean {
  return emojiId?.startsWith("custom-") ?? false
}

/**
 * Get custom emoji URL from ID
 */
export function getCustomEmojiUrl(emojiId: string): string | null {
  if (!isCustomEmoji(emojiId)) return null

  for (const category of customEmojis) {
    const emoji = category.emojis.find((e) => e.id === emojiId)
    if (emoji) {
      return emoji.skins[0].src
    }
  }

  return null
}
