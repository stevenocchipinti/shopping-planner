import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Search, Smile, X } from "lucide-react"

import useSetting from "../../useSetting"
import { Emoji, EmojiPicker } from "../Emoji"
import { cx, IconButton, TextField } from "../ui"
import {
  autocompleteDelete,
  autocompleteItem,
  autocompleteItemText,
  autocompleteList,
  autocompleteRoot,
  field,
  fieldLabel,
  fieldButton,
  helperText,
  tags,
  tag,
  tagRemove,
} from "../ui.css"

const stripSpecialCharacters = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "")

const caseInsensitiveCompare = (option: string, value: string): boolean =>
  option.toLowerCase() === value.toLowerCase()

const fuzzy = (options: string[], inputValue = ""): string[] => {
  const normalizedInput = stripSpecialCharacters(inputValue)
  if (!normalizedInput) return options

  const matcher = new RegExp(
    `.*${normalizedInput
      .split("")
      .join(".*")}.*`,
    "i"
  )

  return options.filter(option => matcher.exec(option))
}

interface AutocompleteCustomProps {
  options?: string[]
  onDelete?: (option: string) => void
  emoji?: string | null | boolean
  onEmojiChange?: (emoji: string | null) => void
  label?: string
  autoFocus?: boolean
  freeSolo?: boolean
  multiple?: boolean
  inputValue?: string
  value?: string | string[]
  onInputChange?: (event: React.SyntheticEvent | null, value: string, reason?: string) => void
  onChange?: (event: React.SyntheticEvent, value: unknown, reason?: string) => void
  placeholder?: string
  id?: string
  disabled?: boolean
}

const Autocomplete = forwardRef(
  (
    {
      onDelete,
      emoji,
      onEmojiChange,
      options = [],
      multiple,
      label,
      autoFocus,
      inputValue,
      onInputChange,
      onChange,
      placeholder,
      id,
      value,
      disabled,
    }: AutocompleteCustomProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const emojiButtonRef = useRef<HTMLButtonElement | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [internalInputValue, setInternalInputValue] = useState("")

    const [emojiSupport] = useSetting("emojiSupport")
    const isControlled = inputValue !== undefined
    const currentInputValue = isControlled ? inputValue : internalInputValue
    const showEmoji = emojiSupport && emoji !== false && (emoji || onEmojiChange)
    const filteredOptions = useMemo(
      () => fuzzy(options, currentInputValue).slice(0, 8),
      [currentInputValue, options]
    )
    const selectedValues = Array.isArray(value) ? value : []

    useEffect(() => {
      if (!menuOpen) setHighlightedIndex(0)
    }, [menuOpen])

    useEffect(() => {
      const handlePointerDown = (event: MouseEvent) => {
        const target = event.target as Node | null
        if (!target) return
        if (wrapperRef.current?.contains(target)) return
        setMenuOpen(false)
      }

      window.addEventListener("mousedown", handlePointerDown)
      return () => window.removeEventListener("mousedown", handlePointerDown)
    }, [])

    const syncRef = (node: HTMLInputElement | null) => {
      inputRef.current = node

      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    }

    const commitSingleValue = (nextValue: string) => {
      const syntheticEvent = { currentTarget: inputRef.current } as unknown as React.SyntheticEvent
      onInputChange?.(syntheticEvent, nextValue, "selectOption")
      onChange?.(syntheticEvent, nextValue, "selectOption")
      if (!isControlled) setInternalInputValue(nextValue)
      setMenuOpen(false)
    }

    const commitMultipleValue = (nextValue: string) => {
      if (selectedValues.some(option => caseInsensitiveCompare(option, nextValue))) {
        setMenuOpen(false)
        return
      }

      const newValues = [...selectedValues, nextValue]
      const syntheticEvent = { currentTarget: inputRef.current } as unknown as React.SyntheticEvent
      onChange?.(syntheticEvent, newValues, "selectOption")
      onInputChange?.(syntheticEvent, "", "reset")
      if (!isControlled) setInternalInputValue("")
      setMenuOpen(false)
    }

    const removeMultipleValue = (option: string) => {
      const newValues = selectedValues.filter(value => !caseInsensitiveCompare(value, option))
      const syntheticEvent = { currentTarget: inputRef.current } as unknown as React.SyntheticEvent
      onChange?.(syntheticEvent, newValues, "removeOption")
    }

    const handleSelect = (option: string) => {
      if (multiple) commitMultipleValue(option)
      else commitSingleValue(option)
      inputRef.current?.focus()
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!menuOpen && ["ArrowDown", "ArrowUp"].includes(event.key) && filteredOptions.length > 0) {
        setMenuOpen(true)
      }

      if (event.key === "ArrowDown") {
        event.preventDefault()
        setHighlightedIndex(index => Math.min(filteredOptions.length - 1, index + 1))
      }

      if (event.key === "ArrowUp") {
        event.preventDefault()
        setHighlightedIndex(index => Math.max(0, index - 1))
      }

      if (event.key === "Enter") {
        if (menuOpen && filteredOptions[highlightedIndex]) {
          event.preventDefault()
          handleSelect(filteredOptions[highlightedIndex])
        } else if (multiple && currentInputValue.trim()) {
          event.preventDefault()
          commitMultipleValue(currentInputValue.trim())
        } else if (!multiple) {
          setMenuOpen(false)
        }
      }

      if (event.key === "Escape") {
        setMenuOpen(false)
      }

      if (
        multiple &&
        event.key === "Backspace" &&
        !currentInputValue &&
        selectedValues.length > 0
      ) {
        removeMultipleValue(selectedValues[selectedValues.length - 1])
      }
    }

    const startAdornment = showEmoji ? (
      <IconButton
        ref={emojiButtonRef}
        onClick={() => setAnchorEl(emojiButtonRef.current)}
        aria-label="Choose emoji"
      >
        {emoji && typeof emoji === "string" ? <Emoji emoji={emoji} size={18} /> : <Smile size={16} />}
      </IconButton>
    ) : (
      <Search size={16} />
    )

    const fieldContent = (
      <>
        {multiple && selectedValues.length > 0 ? (
          <div className={tags}>
            {selectedValues.map(option => (
              <span className={tag} key={option}>
                {option}
                <button
                  className={tagRemove}
                  type="button"
                  onClick={() => removeMultipleValue(option)}
                  aria-label={`Remove ${option}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <TextField
          id={id}
          autoFocus={autoFocus}
          startAdornment={startAdornment}
          placeholder={placeholder}
          value={currentInputValue}
          disabled={disabled}
          inputRef={syncRef}
          onFocus={() => setMenuOpen(true)}
          onKeyDown={handleKeyDown}
          onChange={event => {
            if (!isControlled) setInternalInputValue(event.target.value)
            onInputChange?.(event, event.target.value, "input")
            setMenuOpen(true)
          }}
          aria-autocomplete="list"
          aria-expanded={menuOpen}
        />
      </>
    )

    return (
      <div className={autocompleteRoot} ref={wrapperRef}>
        {label ? (
          <label className={field} htmlFor={id}>
            <span className={fieldLabel}>{label}</span>
            {fieldContent}
          </label>
        ) : (
          fieldContent
        )}

        {showEmoji ? (
          <EmojiPicker
            onSelect={onEmojiChange || (() => {})}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
          />
        ) : null}

        {menuOpen && filteredOptions.length > 0 ? (
          <div className={autocompleteList} role="listbox">
            {filteredOptions.map((option, index) => (
              <div
                key={option}
                className={autocompleteItem}
                data-highlighted={highlightedIndex === index}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <button
                  className={fieldButton}
                  type="button"
                  onClick={() => handleSelect(option)}
                >
                  <span className={autocompleteItemText}>{option}</span>
                </button>
                {onDelete ? (
                  <button
                    className={autocompleteDelete}
                    type="button"
                    onClick={event => {
                      event.stopPropagation()
                      onDelete(option)
                    }}
                    aria-label={`Delete ${option}`}
                    >
                      <X size={14} />
                    </button>
                  ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {multiple ? <p className={helperText}>Press Enter to add ingredients.</p> : null}
      </div>
    )
  }
)

Autocomplete.displayName = "Autocomplete"

export default Autocomplete
