import { customEmojis } from "./custom-emojis"
import { init, SearchIndex } from "emoji-mart"

// Initialize emoji-mart data
let emojiDataPromise: Promise<void> | null = null

async function initEmojiData() {
  if (!emojiDataPromise) {
    emojiDataPromise = init({
      data: async () => {
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
        )
        return response.json()
      },
    })
  }
  await emojiDataPromise
}

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
 * Search for standard emojis using emoji-mart
 * Returns native emoji character or null
 */
async function searchStandardEmojis(
  searchTerm: string
): Promise<string | null> {
  try {
    await initEmojiData()
    const results = await SearchIndex.search(searchTerm)
    
    // Return the first result's native character
    if (results && results.length > 0) {
      return results[0].skins[0].native
    }
  } catch (error) {
    console.error("Error searching standard emojis:", error)
  }
  
  return null
}

/**
 * Search for emojis with custom emojis prioritized
 * Returns emoji ID (custom-* for custom emojis) or native emoji character for standard emojis
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

  // Try standard emojis
  const standardResult = await searchStandardEmojis(searchTerm)
  return standardResult
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

/**
 * Convert an emoji-mart shortcode ID to native emoji character
 * Used for backward compatibility with data from the old app
 */
export async function shortcodeToNative(shortcode: string): Promise<string | null> {
  try {
    await initEmojiData()
    // Search by the exact shortcode
    const results = await SearchIndex.search(shortcode)
    
    // Look for an exact ID match first
    if (results && results.length > 0) {
      for (const result of results) {
        if (result.id === shortcode) {
          return result.skins[0].native
        }
      }
      // If no exact match, return the first result
      return results[0].skins[0].native
    }
  } catch (error) {
    console.error("Error converting shortcode to native:", error)
  }
  
  return null
}
