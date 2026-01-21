/**
 * CRITICAL: This must match the old implementation exactly for backward compatibility
 * Old implementation: src/helpers.js lines 8-14
 *
 * Convert a string to a URL-safe slug for use as Firestore document ID
 *
 * Example: "Whole Milk" -> "whole-milk"
 */
export function slugify(s: string | undefined | null): string {
  return (
    s
      ?.toString()
      ?.toLowerCase()
      ?.trim()
      ?.replace(/[\s\W-]+/g, "-")
      ?.replace(/^-+|-+$/g, "") || ""
  )
}

/**
 * Convert a slug back to a readable string
 * Example: "whole-milk" -> "Whole Milk"
 */
export function unslugify(s: string | undefined | null): string {
  return (
    s
      ?.split("-")
      ?.filter(Boolean)
      ?.map(word => word[0]?.toUpperCase() + word.slice(1))
      ?.join(" ") || ""
  )
}

/**
 * Capitalize the first letter of a string
 * Example: "milk" -> "Milk"
 */
function capitalize(s: string): string {
  return `${s[0]?.toUpperCase() || ""}${s?.slice(1)}`
}

/**
 * CRITICAL: This must match the old implementation exactly for backward compatibility
 * Old implementation: src/helpers.js lines 3-4
 *
 * Prettify user input by trimming, normalizing whitespace, and capitalizing each word.
 * This is applied when storing item names and sections to the database.
 *
 * Example: "  whole   milk  " -> "Whole Milk"
 */
export function prettify(s: string | undefined | null): string {
  return s?.trim()?.split(/\s+/)?.map(capitalize)?.join(" ") || ""
}
