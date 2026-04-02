export const capitalize = (s: string): string =>
  `${s[0]?.toUpperCase() || ""}${s?.slice(1)}`

export const prettify = (s: string): string =>
  s?.trim()?.split(/\s+/)?.map(capitalize)?.join(" ") || ""

export const normalizeSection = (s: string): string => prettify(s)

export const unslugify = (s: string): string =>
  s?.split("-")?.map(capitalize)?.join(" ")

export const slugify = (s: string): string =>
  s
    ?.toString()
    ?.toLowerCase()
    ?.trim()
    ?.replace(/[\s\W-]+/g, "-")
    ?.replace(/^-+|-+$/g, "")
