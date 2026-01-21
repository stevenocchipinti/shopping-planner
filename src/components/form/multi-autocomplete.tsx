import { useState, useRef, useEffect } from "react"
import { Emoji } from "@/components/ui/emoji"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface MultiAutocompleteOption {
  value: string
  label: string
  emoji?: string | null
}

interface SelectedItem {
  value: string
  label: string
  emoji?: string | null
}

interface MultiAutocompleteProps {
  value: SelectedItem[]
  onChange: (value: SelectedItem[]) => void
  options: MultiAutocompleteOption[]
  placeholder?: string
  className?: string
}

export function MultiAutocomplete({
  value,
  onChange,
  options,
  placeholder = "Add ingredient...",
  className,
}: MultiAutocompleteProps) {
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter options based on input value and exclude already selected items
  const selectedValues = new Set(value.map(item => item.value))
  const filteredOptions = inputValue.trim()
    ? options.filter(
        option =>
          option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedValues.has(option.value)
      )
    : options.filter(option => !selectedValues.has(option.value))

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0)
  }, [inputValue])

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedItem = listRef.current.children[
        highlightedIndex
      ] as HTMLElement
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: "nearest" })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  const handleSelect = (option: MultiAutocompleteOption) => {
    onChange([
      ...value,
      { value: option.value, label: option.label, emoji: option.emoji },
    ])
    setInputValue("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleRemove = (itemToRemove: SelectedItem) => {
    onChange(value.filter(item => item.value !== itemToRemove.value))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove last item when backspace on empty input
      handleRemove(value[value.length - 1])
      return
    }

    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true)
      e.preventDefault()
      return
    }

    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (filteredOptions[highlightedIndex]) {
        // Select highlighted option
        handleSelect(filteredOptions[highlightedIndex])
      } else {
        // Add as custom item
        const label = inputValue.trim()
        const customValue = label.toLowerCase().replace(/\s+/g, "-")
        if (!selectedValues.has(customValue)) {
          onChange([...value, { value: customValue, label }])
          setInputValue("")
          setIsOpen(false)
        }
      }
      return
    }

    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case "Escape":
        setIsOpen(false)
        break
    }
  }

  const handleFocus = () => {
    setIsOpen(true)
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Check if the related target is inside our component
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return
    }
    // Delay closing to allow click on options
    setTimeout(() => setIsOpen(false), 150)
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div
        onClick={handleContainerClick}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "cursor-text"
        )}
      >
        {value.map(item => (
          <span
            key={item.value}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium"
          >
            {item.emoji && <Emoji id={item.emoji} size={14} />}
            <span>{item.label}</span>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                handleRemove(item)
              }}
              className="ml-0.5 rounded-full p-0.5 hover:bg-secondary-foreground/20 focus:outline-none"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {item.label}</span>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={value.length === 0 ? placeholder : ""}
          autoComplete="off"
          className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>
      {isOpen && filteredOptions.length > 0 && (
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
              {option.emoji && <Emoji id={option.emoji} size={16} />}
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
