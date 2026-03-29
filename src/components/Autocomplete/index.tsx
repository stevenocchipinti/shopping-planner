import React, { forwardRef, ForwardedRef } from "react"

import Autocomplete from "./Autocomplete"
import { useAppState } from "../Backend"
import { normalizeSection, unslugify, slugify } from "../../helpers"
import { emojiSearch } from "../Emoji"

const defaultEmojiFor = (value: string): string | null => {
  return emojiSearch(value)?.[0]?.id || null
}

interface ItemAutocompleteProps {
  onChange: (value: string) => void
  value: string
  emoji?: string | null
  onEmojiChange?: (emoji: string | null) => void
  onDelete?: (option: string) => void
  autoFocus?: boolean
  label?: string
}

const ItemAutocomplete = forwardRef(
  ({ onChange, value, ...props }: ItemAutocompleteProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { catalogue } = useAppState()
    const allItems = Object.keys(catalogue).map(unslugify)

    const handleChange = (e: React.SyntheticEvent | null, newValue: string | null) => {
      if (!e) return false

      onChange(newValue || "")
      if (props.emoji || props.onEmojiChange) {
        const catalogueEntry = catalogue[slugify(newValue || "")]
        const storedEmoji = catalogueEntry?.emoji
        props.onEmojiChange?.(
          storedEmoji ? storedEmoji : defaultEmojiFor(newValue || "")
        )
      }
    }

    return (
      <Autocomplete
        label="Item"
        id="item-search"
        options={Array.from(new Set(allItems))}
        ref={ref}
        inputValue={value}
        onInputChange={handleChange}
        {...props}
      />
    )
  }
)

ItemAutocomplete.displayName = "ItemAutocomplete"

interface SectionAutocompleteProps {
  onChange: (value: string) => void
  value: string
  onDelete?: (option: string) => void
  autoFocus?: boolean
}

const SectionAutocomplete = forwardRef(
  ({ onChange, value, ...props }: SectionAutocompleteProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { catalogue } = useAppState()
    const allSections = Object.values(catalogue)
      .map(e => normalizeSection(e.section || ""))
      .filter(Boolean) as string[]
    
    return (
      <Autocomplete
        label="Section"
        id="section-search"
        options={Array.from(new Set(allSections))}
        ref={ref}
        inputValue={value}
        onInputChange={(e: React.SyntheticEvent | null, newValue: string) => e && onChange(newValue || "")}
        {...props}
      />
    )
  }
)

SectionAutocomplete.displayName = "SectionAutocomplete"

interface ItemOrRecipeAutocompleteProps {
  onChange: (value: string) => void
  value: string
  emoji?: string | null
  onEmojiChange?: (emoji: string | null) => void
  onDelete?: (option: string) => void
  autoFocus?: boolean
}

const ItemOrRecipeAutocomplete = forwardRef(
  ({ onChange, value, ...props }: ItemOrRecipeAutocompleteProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { catalogue, recipes } = useAppState()
    const allItems = [
      ...Object.keys(recipes).map(unslugify),
      ...Object.keys(catalogue).map(unslugify),
    ]

    const handleChange = (e: React.SyntheticEvent | null, newValue: string | null) => {
      if (!e) return false

      onChange(newValue || "")
      if (props.emoji || props.onEmojiChange) {
        const recipeEntry = recipes[slugify(newValue || "")]
        const catalogueEntry = catalogue[slugify(newValue || "")]
        const storedEmoji = recipeEntry?.emoji || catalogueEntry?.emoji
        props.onEmojiChange?.(
          storedEmoji ? storedEmoji : defaultEmojiFor(newValue || "")
        )
      }
    }

    return (
      <Autocomplete
        label="Item or recipe"
        id="item-or-recipe-search"
        options={Array.from(new Set(allItems))}
        ref={ref}
        inputValue={value}
        onInputChange={handleChange}
        {...props}
      />
    )
  }
)

ItemOrRecipeAutocomplete.displayName = "ItemOrRecipeAutocomplete"

export interface IngredientAutocompleteProps {
  value?: string[]
  onChange: (value: string[]) => void
  onDelete?: (option: string) => void
  autoFocus?: boolean
}

const IngredientAutocomplete = forwardRef(
  ({ onChange, ...props }: IngredientAutocompleteProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { catalogue } = useAppState()
    const allItems = Object.keys(catalogue).map(unslugify)

    return (
        <Autocomplete
          multiple
          emoji={false}
          label="Ingredients"
          id="ingredient-search"
          options={Array.from(new Set(allItems))}
          ref={ref}
          onChange={(e: React.SyntheticEvent, newValue: unknown) => e && onChange(newValue as string[])}
          value={props.value}
          {...props}
      />
    )
  }
)

IngredientAutocomplete.displayName = "IngredientAutocomplete"

export default Autocomplete
export {
  ItemAutocomplete,
  SectionAutocomplete,
  ItemOrRecipeAutocomplete,
  IngredientAutocomplete,
}
