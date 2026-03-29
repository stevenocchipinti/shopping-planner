import React from "react"
import { MinusCircle, PlusCircle } from "lucide-react"

import { numberInput, numberInputField, numberPicker } from "../dialogs.css"
import { IconButton, TextField } from "../ui"

interface NumberPickerProps {
  onChange: (value: number) => void
  value: number
  [key: string]: unknown
}

const NumberPicker = ({ onChange, value, ...props }: NumberPickerProps) => {
  const val = parseInt(value.toString())
  const dec = () => val - 1 > 0 && onChange(val - 1)
  const inc = () => onChange(val + 1)

  return (
    <div className={numberPicker}>
      <IconButton onClick={dec} tabIndex={-1} aria-label="Decrement quantity">
        <MinusCircle size={18} />
      </IconButton>
      <TextField
        inputClassName={numberInput}
        inputMode="numeric"
        pattern="[0-9]+"
        required
        placeholder="Quantity"
        aria-label="Quantity"
        onChange={event => onChange(parseInt(event.target.value, 10))}
        value={value}
        {...props}
      />
      <IconButton onClick={inc} tabIndex={-1} aria-label="Increment quantity">
        <PlusCircle size={18} />
      </IconButton>
    </div>
  )
}

export default NumberPicker
