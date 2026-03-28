import React, { useState, useRef, useCallback, forwardRef, ForwardedRef } from "react"
import styled from "styled-components"

import {
  Autocomplete as MuiAutocomplete,
  IconButton,
  TextField,
} from "@mui/material"
import {
  Delete as DeleteIcon,
  InsertEmoticon as InsertEmoticonIcon,
} from "@mui/icons-material"

import { EmojiPicker, Emoji } from "../Emoji"
import useSetting from "../../useSetting"

const StyledAutocomplete = styled(MuiAutocomplete)`
  margin-bottom: 1rem;
` as typeof MuiAutocomplete

const stripSpecialCharacters = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "")

const caseInsensitiveCompare = (option: string, value: string): boolean =>
  option.toLowerCase() === value.toLowerCase()

const fuzzy = (options: string[], { inputValue }: { inputValue?: string }): string[] => {
  const normalizedInput = stripSpecialCharacters(inputValue || "")
  const r = new RegExp(
    `.*${normalizedInput
      .split("")
      .join(".*")}.*`,
    "i"
  )
  return options.filter(o => r.exec(o))
}

const OptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

interface OptionProps {
  option: string
  onDelete: (option: string) => void
}

const Option: React.FC<OptionProps> = ({ option, onDelete }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(option)
  }
  return (
    <OptionWrapper>
      <span>{option}</span>
      <IconButton
        edge="end"
        size="small"
        onClick={handleClick}
        aria-label="delete"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </OptionWrapper>
  )
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
  renderInput?: (params: any) => React.ReactElement
  id?: string
  [key: string]: unknown
}

const Autocomplete = forwardRef(
  (
    { onDelete, emoji, onEmojiChange, options = [], multiple, renderInput: customRenderInput, ...props }: AutocompleteCustomProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const emojiPickerRef = useRef<HTMLButtonElement>(null)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)
    const emojiPickerOpen = Boolean(anchorEl)

    const [emojiSupport] = useSetting("emojiSupport")
    const showEmoji = emojiSupport && emoji !== false && (emoji || onEmojiChange)
    const emojiProps =
      showEmoji
        ? {
            style: { padding: 4 },
            startAdornment: (
              <IconButton ref={emojiPickerRef} onClick={handleClick}>
                {emoji && typeof emoji === "string" ? <Emoji emoji={emoji} /> : <InsertEmoticonIcon />}
              </IconButton>
            ),
          }
        : {}

    const memoOption = useCallback(
      (renderProps: React.HTMLAttributes<HTMLLIElement> & { key: React.Key }, option: string) => (
        <li {...renderProps}>
          <Option option={option} onDelete={onDelete || (() => {})} />
        </li>
      ),
      [onDelete]
    )

    return (
      <>
        {emojiSupport && (
          <EmojiPicker
            onSelect={onEmojiChange || (() => {})}
            open={emojiPickerOpen}
            anchorEl={emojiPickerRef.current}
            onClose={handleClose}
          />
        )}
        <StyledAutocomplete
          freeSolo
          multiple={multiple as any}
          isOptionEqualToValue={caseInsensitiveCompare}
          filterOptions={fuzzy}
          options={options}
          renderOption={onDelete ? memoOption as any : undefined}
          renderInput={customRenderInput || ((params: any) => (
            <TextField
              {...params}
              autoFocus={props.autoFocus}
              label={props.label}
              inputRef={ref}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                ...emojiProps,
              }}
            />
          ))}
          {...props}
        />
      </>
    )
  }
)

Autocomplete.displayName = "Autocomplete"

export default Autocomplete
