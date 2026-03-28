import React from "react"
import styled from "styled-components"
import {
  ToggleButtonGroup as MuiToggleButtonGroup,
  ToggleButton as MuiToggleButton,
} from "@mui/material"

const ToggleButtonGroup = styled(MuiToggleButtonGroup)`
  width: 100%;
  margin-bottom: 2rem;
`

const ToggleButton = styled(MuiToggleButton)`
  flex-grow: 1;
`

interface DayPickerProps {
  days: string[]
  value: string | null
  onChange: (value: string) => void
}

const DayPicker = ({ days, value, onChange }: DayPickerProps) => (
  <ToggleButtonGroup
    exclusive
    value={value || days[0]}
    onChange={(e, v) => onChange(v)}
    aria-label="Day"
  >
    {days.map(d => (
      <ToggleButton key={d} value={d}>
        {d[0]}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
)

export default DayPicker
