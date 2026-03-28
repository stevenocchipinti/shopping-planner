import { Theme } from "@mui/material/styles"

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

export const greys = (
  light: number,
  dark: number
): ((props: { theme: Theme }) => string) =>
  ({ theme }) =>
    theme.palette.mode === "light"
      ? theme.palette.grey[light as keyof typeof theme.palette.grey]
      : theme.palette.grey[dark as keyof typeof theme.palette.grey]
