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
export function prettify(s: string | undefined | null): string {
  return (
    s
      ?.split("-")
      ?.filter(Boolean)
      ?.map((word) => word[0]?.toUpperCase() + word.slice(1))
      ?.join(" ") || ""
  )
}
