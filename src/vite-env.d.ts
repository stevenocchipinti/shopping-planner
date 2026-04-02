/// <reference types="vite/client" />

declare module "*.png" {
  const src: string
  export default src
}

declare module "*.svg" {
  const src: string
  export default src
}

declare module "*.jpg" {
  const src: string
  export default src
}

declare module "*.jpeg" {
  const src: string
  export default src
}

declare module "*.gif" {
  const src: string
  export default src
}

declare module "@emoji-mart/react" {
  import { ComponentType } from "react"
  const Picker: ComponentType<Record<string, unknown>>
  export default Picker
}

declare module "@emoji-mart/data" {
  const data: {
    emojis: Record<string, { skins: Array<{ native?: string }> }>
  }
  export default data
}

declare module "@emoji-mart/data/sets/15/apple.json" {
  const data: Record<string, unknown>
  export default data
}

declare module "emoji-mart" {
  export function init(options: { data: unknown }): void
}

declare module "react-masonry-css" {
  import { ComponentType, ReactNode } from "react"
  interface MasonryProps {
    breakpointCols?: number | Record<string, number>
    className?: string
    columnClassName?: string
    children?: ReactNode
  }
  const Masonry: ComponentType<MasonryProps>
  export default Masonry
}
