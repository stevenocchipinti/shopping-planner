import data from "@emoji-mart/data"
import { init } from "emoji-mart"

import customEmojis from "./customEmojis"

const customCategories = [
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
