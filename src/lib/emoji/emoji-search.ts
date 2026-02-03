import { customEmojis, customEmojiMap } from "./custom-emojis"
import { EMOJI_SHORTCODE_MAP } from "./emoji-map"

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

  // Search through all custom emoji using the transformed data
  for (const customEmoji of customEmojis) {
    for (const name of customEmoji.names) {
      if (name.toLowerCase().includes(normalized)) {
        return customEmoji.id
      }
    }
  }

  return null
}

/**
 * Search for emojis with custom emojis prioritized
 * Returns emoji ID for custom ("custom-broccoli") or emoji character for standard ("🍎")
 *
 * Note: Standard emoji search is limited without emoji data library.
 * For better UX, consider the picker itself handles standard emoji search.
 */
export async function searchEmoji(searchTerm: string): Promise<string | null> {
  if (!searchTerm.trim()) return null

  // Try custom emojis first (priority)
  const customResult = searchCustomEmojis(searchTerm)
  if (customResult) {
    return customResult
  }

  // Standard emoji search would require emoji data library
  // For now, custom emojis are the primary search target
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
 * Uses the pre-computed map for O(1) lookup
 */
export function getCustomEmojiUrl(emojiId: string): string | null {
  if (!isCustomEmoji(emojiId)) return null

  const metadata = customEmojiMap[emojiId]
  if (metadata) {
    return metadata.imgUrl
  }

  return null
}

/**
 * Get custom emoji name from ID
 * Uses the pre-computed map for O(1) lookup
 */
export function getCustomEmojiName(emojiId: string): string | null {
  if (!isCustomEmoji(emojiId)) return null

  const metadata = customEmojiMap[emojiId]
  if (metadata) {
    return metadata.name
  }

  return null
}

/**
 * Convert an emoji shortcode to its Unicode character
 * Handles:
 * - Shortcodes like "green_apple" -> "🍏"
 * - Native emojis (already Unicode) -> returned as-is
 * - Custom emojis (custom-broccoli) -> returned as-is (handled by isCustomEmoji check)
 *
 * Note: This function is async for potential future use cases (e.g., API lookups)
 * but currently executes synchronously using the emoji map.
 */
export async function shortcodeToNative(
  emojiInput: string
): Promise<string | null> {
  // If it's already a native emoji (contains emoji characters), return it
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/u

  if (emojiRegex.test(emojiInput)) {
    return emojiInput
  }

  // Try to convert shortcode to emoji using the map
  if (emojiInput in EMOJI_SHORTCODE_MAP) {
    return EMOJI_SHORTCODE_MAP[emojiInput]
  }

  // Not a recognized emoji format
  return null
}
