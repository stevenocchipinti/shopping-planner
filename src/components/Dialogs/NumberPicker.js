import React from "react"
import styled from "styled-components"
import { IconButton, TextField } from "@mui/material"
import {
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material"

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 0.5rem 0 1rem;
`

const Qty = styled(TextField)`
  width: 5.5rem;

  & .MuiOutlinedInput-input {
    text-align: center;
  }
`

const NumberPicker = ({ onChange, value, ...props }) => {
  const val = parseInt(value)
  const dec = newValue => val - 1 > 0 && onChange(val - 1)
  const inc = newValue => onChange(val + 1)

  return (
    <Container>
      <IconButton onClick={dec} tabIndex={-1} aria-label="Decrement quantity">
        <RemoveCircleOutlineIcon />
      </IconButton>
      <Qty
        type="tel"
        inputProps={{
          pattern: "[0-9]+",
          required: true,
        }}
        label="Quantity"
        variant="outlined"
        onChange={e => onChange(e.target.value)}
        value={value}
        {...props}
      />
      <IconButton onClick={inc} tabIndex={-1} aria-label="Increment quantity">
        <AddCircleOutlineIcon />
      </IconButton>
    </Container>
  )
}

export default NumberPicker
