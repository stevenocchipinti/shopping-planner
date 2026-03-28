import customEmojis from "./customEmojis"

const nativeEmojiHints = {
  apple: "🍎",
  apples: "🍎",
  banana: "🍌",
  bananas: "🍌",
  bread: "🍞",
  broccoli: "🥦",
  carrot: "🥕",
  cheese: "🧀",
  chicken: "🍗",
  chilli: "🌶️",
  chili: "🌶️",
  coffee: "☕",
  corn: "🌽",
  cucumber: "🥒",
  egg: "🥚",
  eggs: "🥚",
  fish: "🐟",
  garlic: "🧄",
  grapes: "🍇",
  lemon: "🍋",
  lettuce: "🥬",
  lime: "🍋",
  meat: "🥩",
  milk: "🥛",
  mushroom: "🍄",
  onion: "🧅",
  peach: "🍑",
  pear: "🍐",
  pepper: "🫑",
  pineapple: "🍍",
  pizza: "🍕",
  potato: "🥔",
  pumpkin: "🎃",
  rice: "🍚",
  salad: "🥗",
  salt: "🧂",
  strawberry: "🍓",
  sushi: "🍣",
  taco: "🌮",
  tomato: "🍅",
  watermelon: "🍉",
}

const normalize = value =>
  value
    .trim()
    .toLowerCase()
    .replace(/[.*+?^${}()|[\]\\]/g, "")

const singularize = value => value.replace(/i?e?s?$/, "")

const searchCustom = searchTerm => {
  if (searchTerm === "") return []
  const broaderSearch = singularize(normalize(searchTerm))

  return customEmojis
    .filter(customEmoji =>
      customEmoji.keywords.some(keywords => keywords.match(broaderSearch))
    )
    .map(customEmoji => ({
      ...customEmoji,
      id: customEmoji.short_names[0],
    }))
}

export default searchTerm => {
  const normalized = normalize(searchTerm)
  const singular = singularize(normalized)

  if (nativeEmojiHints[normalized]) {
    return [{ id: nativeEmojiHints[normalized] }]
  }

  if (nativeEmojiHints[singular]) {
    return [{ id: nativeEmojiHints[singular] }]
  }

  const custom = searchCustom(normalized)

  if (custom.length > 0) return custom

  const native = Object.entries(nativeEmojiHints).find(([term]) =>
    normalized.includes(term) || singular.includes(term)
  )

  return native ? [{ id: native[1] }] : []
}
