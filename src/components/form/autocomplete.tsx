import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Emoji } from "@/components/ui/emoji"
import { cn } from "@/lib/utils"

interface AutocompleteOption {
  value: string
  label: string
  emoji?: string | null
}

interface AutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (option: AutocompleteOption) => void
  options: AutocompleteOption[]
  placeholder?: string
  autoFocus?: boolean
  className?: string
  endAdornment?: React.ReactNode
  startAdornment?: React.ReactNode
  inputRef?: React.RefObject<HTMLInputElement | null>
}

export function Autocomplete({
  value,
  onChange,
  onSelect,
  options,
  placeholder,
  autoFocus,
  className,
  endAdornment,
  startAdornment,
  inputRef: externalInputRef,
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const internalInputRef = useRef<HTMLInputElement>(null)
  const inputRef = externalInputRef || internalInputRef
  const listRef = useRef<HTMLUListElement>(null)

  // Filter options based on input value
  const filteredOptions = value.trim()
    ? options.filter((option) =>
        option.label.toLowerCase().includes(value.toLowerCase())
      )
    : options

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0)
  }, [value])

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedItem = listRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: "nearest" })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setIsOpen(true)
  }

  const handleSelect = (option: AutocompleteOption) => {
    onChange(option.label)
    onSelect?.(option)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case "Enter":
        e.preventDefault()
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        break
    }
  }

  const handleFocus = () => {
    // Only show autocomplete if user has typed something
    if (value.trim()) {
      setIsOpen(true)
    }
  }

  const handleBlur = () => {
    // Delay closing to allow click on options
    setTimeout(() => setIsOpen(false), 150)
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {startAdornment && (
          <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10">
            {startAdornment}
          </div>
        )}
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          className={cn(
            startAdornment && "pl-10",
            endAdornment && "pr-10"
          )}
        />
        {endAdornment && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            {endAdornment}
          </div>
        )}
      </div>
      {isOpen && filteredOptions.length > 0 && value.trim() && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md"
        >
          {filteredOptions.slice(0, 20).map((option, index) => (
            <li
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                index === highlightedIndex && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.emoji && (
                <Emoji id={option.emoji} size={16} />
              )}
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
