import data from "@emoji-mart/data/sets/15/apple.json"
import { init } from "emoji-mart"

import customEmojis, { CustomEmoji } from "./customEmojis"

interface CustomCategory {
  id: string
  name: string
  emojis: Array<{
    id: string
    name: string
    keywords: string[]
    skins: Array<{ src: string }>
  }>
}

const customCategories: CustomCategory[] = [
  {
    id: "shopping-planner",
    name: "Shopping Planner",
    emojis: customEmojis.map(({ name, short_names, keywords, imageUrl }) => ({
      id: short_names[0],
      name,
      keywords,
      skins: [{ src: imageUrl }],
    })),
  },
]

init({ data })

export { data, customCategories }
