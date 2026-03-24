import customEmojis from "./customEmojis"

const searchCustom = searchTerm => {
  if (searchTerm === "") return []
  const broaderSearch = searchTerm
    .replace(/[.*+?^${}()|[\]\\]/g, "")
    .replace(/i?e?s?$/, "")
    .toLowerCase()

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
  return searchCustom(searchTerm.trim())
}
